
interface ProctoringSubmissionData {
  examId: string;
  webcamBlobs: Blob[];
  screenBlobs: Blob[];
  violations: any[];
  submittedAt: string;
  submittedBy: {
    userId?: string;
    email?: string;
    name?: string;
    type?: string;
    sessionId?: string;
  };
}

// Helper function to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:video/webm;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const proctoringApi = {
  async submitProctoringData(data: ProctoringSubmissionData) {
    try {
      console.log('Converting proctoring data to JSON format...');
      
      // Convert webcam blobs to base64
      const webcamRecordings = await Promise.all(
        data.webcamBlobs.map(async (blob, index) => ({
          index,
          data: await blobToBase64(blob),
          mimeType: blob.type || 'video/webm',
          size: blob.size
        }))
      );
      
      // Convert screen blobs to base64
      const screenRecordings = await Promise.all(
        data.screenBlobs.map(async (blob, index) => ({
          index,
          data: await blobToBase64(blob),
          mimeType: blob.type || 'video/webm',
          size: blob.size
        }))
      );
      
      // Prepare JSON payload
      const jsonPayload = {
        examId: data.examId,
        submittedAt: data.submittedAt,
        submittedBy: data.submittedBy,
        violations: data.violations,
        recordings: {
          webcam: webcamRecordings,
          screen: screenRecordings
        },
        metadata: {
          totalWebcamRecordings: webcamRecordings.length,
          totalScreenRecordings: screenRecordings.length,
          totalViolations: data.violations.length,
          submissionTimestamp: new Date().toISOString()
        }
      };
      
      console.log('Sending proctoring data as JSON:', {
        examId: data.examId,
        webcamCount: webcamRecordings.length,
        screenCount: screenRecordings.length,
        violationsCount: data.violations.length
      });
      
      const response = await fetch('https://api.examplatform.com/v1/proctoring/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(jsonPayload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Proctoring data submitted successfully:', result);
      return result;
      
    } catch (error) {
      console.error('Failed to submit proctoring data:', error);
      // Don't throw - proctoring submission shouldn't block exam submission
      return { success: false, error: error.message };
    }
  }
};
