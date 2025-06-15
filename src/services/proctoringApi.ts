
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

export const proctoringApi = {
  async submitProctoringData(data: ProctoringSubmissionData) {
    try {
      console.log('Preparing proctoring data for submission...');
      
      const formData = new FormData();
      
      // Add metadata as JSON strings
      formData.append('examId', data.examId);
      formData.append('submittedAt', data.submittedAt);
      formData.append('violations', JSON.stringify(data.violations));
      formData.append('submittedBy', JSON.stringify(data.submittedBy));
      
      // Add metadata counts for easy backend processing
      formData.append('metadata', JSON.stringify({
        totalWebcamRecordings: data.webcamBlobs.length,
        totalScreenRecordings: data.screenBlobs.length,
        totalViolations: data.violations.length,
        submissionTimestamp: new Date().toISOString()
      }));
      
      // Add webcam recordings as blobs
      data.webcamBlobs.forEach((blob, index) => {
        formData.append(`webcam_${index}`, blob, `webcam_${index}.webm`);
      });
      
      // Add screen recordings as blobs
      data.screenBlobs.forEach((blob, index) => {
        formData.append(`screen_${index}`, blob, `screen_${index}.webm`);
      });
      
      console.log('Sending proctoring data with FormData:', {
        examId: data.examId,
        webcamCount: data.webcamBlobs.length,
        screenCount: data.screenBlobs.length,
        violationsCount: data.violations.length,
        totalSize: data.webcamBlobs.reduce((acc, blob) => acc + blob.size, 0) + 
                   data.screenBlobs.reduce((acc, blob) => acc + blob.size, 0)
      });
      
      const response = await fetch('https://api.examplatform.com/v1/proctoring/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData
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
