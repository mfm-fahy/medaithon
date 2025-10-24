import * as ort from 'onnxruntime-node';
import path from 'path';

interface VitalsData {
  height: number;
  weight: number;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  pulse: number;
}

interface BloodPressure {
  systolic: number;
  diastolic: number;
}

class TriageService {
  private session: ort.InferenceSession | null = null;
  private modelPath: string;

  constructor() {
    this.modelPath = path.join(__dirname, '../../triage_model.onnx');
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('🔄 Loading ONNX triage model from:', this.modelPath);
      this.session = await ort.InferenceSession.create(this.modelPath);
      console.log('✅ Triage model loaded successfully');
      
      // Log model input/output info
      console.log('📊 Model inputs:', this.session.inputNames);
      console.log('📊 Model outputs:', this.session.outputNames);
      
      return true;
    } catch (error) {
      console.error('❌ Error loading triage model:', (error as Error).message);
      return false;
    }
  }

  /**
   * Parse blood pressure string (e.g., "120/80") to systolic and diastolic
   */
  parseBloodPressure(bpString: string): BloodPressure {
    const parts = bpString.split('/');
    return {
      systolic: parseFloat(parts[0]) || 0,
      diastolic: parseFloat(parts[1]) || 0,
    };
  }

  /**
   * Predict triage color based on vitals
   */
  async predictTriageColor(vitals: VitalsData): Promise<string> {
    try {
      if (!this.session) {
        console.warn('⚠️ Triage model not initialized, using fallback');
        return this.getFallbackTriageColor(vitals);
      }

      // Parse blood pressure
      const bp = this.parseBloodPressure(vitals.bloodPressure);

      // Prepare input data - normalize values
      const inputData = [
        vitals.height / 200,           // Normalize height (0-200 cm)
        vitals.weight / 150,           // Normalize weight (0-150 kg)
        vitals.temperature / 42,       // Normalize temperature (0-42°C)
        bp.systolic / 200,             // Normalize systolic BP (0-200)
        bp.diastolic / 120,            // Normalize diastolic BP (0-120)
        vitals.heartRate / 200,        // Normalize heart rate (0-200 bpm)
        vitals.respiratoryRate / 50,   // Normalize respiratory rate (0-50)
        vitals.pulse / 200,            // Normalize pulse (0-200)
      ];

      console.log('🔍 Input data for triage prediction:', inputData);

      // Create tensor
      const inputTensor = new ort.Tensor('float32', inputData, [1, 8]);

      // Run inference
      const results = await this.session.run({ [this.session.inputNames[0]]: inputTensor });

      // Get output
      const outputName = this.session.outputNames[0];
      const output = results[outputName];
      const predictions = Array.from(output.data as Float32Array);

      console.log('📊 Model predictions:', predictions);

      // Map predictions to triage colors
      const colors = ['red', 'yellow', 'green', 'blue'];
      const maxIndex = predictions.indexOf(Math.max(...predictions));
      const triageColor = colors[maxIndex] || 'green';

      console.log(`✅ Predicted triage color: ${triageColor}`);
      return triageColor;
    } catch (error) {
      console.error('❌ Error predicting triage color:', (error as Error).message);
      return this.getFallbackTriageColor(vitals);
    }
  }

  /**
   * Fallback triage prediction based on vital thresholds
   */
  getFallbackTriageColor(vitals: VitalsData): string {
    console.log('📋 Using fallback triage prediction');

    const bp = this.parseBloodPressure(vitals.bloodPressure);
    let severity = 0;

    // Check temperature
    if (vitals.temperature > 39 || vitals.temperature < 35) severity += 2;
    else if (vitals.temperature > 38 || vitals.temperature < 36) severity += 1;

    // Check heart rate
    if (vitals.heartRate > 120 || vitals.heartRate < 50) severity += 2;
    else if (vitals.heartRate > 100 || vitals.heartRate < 60) severity += 1;

    // Check blood pressure
    if (bp.systolic > 180 || bp.systolic < 90 || bp.diastolic > 120 || bp.diastolic < 60) severity += 2;
    else if (bp.systolic > 160 || bp.systolic < 100 || bp.diastolic > 100 || bp.diastolic < 70) severity += 1;

    // Check respiratory rate
    if (vitals.respiratoryRate > 30 || vitals.respiratoryRate < 10) severity += 2;
    else if (vitals.respiratoryRate > 25 || vitals.respiratoryRate < 12) severity += 1;

    // Map severity to color
    if (severity >= 6) return 'red';      // Critical
    if (severity >= 4) return 'yellow';   // Urgent
    if (severity >= 2) return 'blue';     // Semi-urgent
    return 'green';                       // Non-urgent
  }
}

// Create singleton instance
let triageService: TriageService | null = null;

export async function getTriageService(): Promise<TriageService> {
  if (!triageService) {
    triageService = new TriageService();
    await triageService.initialize();
  }
  return triageService;
}

export { TriageService };

