
interface ProctoringSubmissionData {
  examId: string;
  webcamBlobs: Blob[];
  screenBlobs: Blob[];
  violations: any[];
  submittedAt: string;
}

export const proctoringApi = {
  async submitProctoringData(data: ProctoringSubmissionData) {
    try {
      const formData = new FormData();
      
      // Add metadata
      formData.append('examId', data.examId);
      formData.append('submittedAt', data.submittedAt);
      formData.append('violations', JSON.stringify(data.violations));
      
      // Add webcam recordings
      data.webcamBlobs.forEach((blob, index) => {
        formData.append(`webcam_${index}`, blob, `webcam_${index}.webm`);
      });
      
      // Add screen recordings
      data.screenBlobs.forEach((blob, index) => {
        formData.append(`screen_${index}`, blob, `screen_${index}.webm`);
      });
      
      const response = await fetch('https://api.examplatform.com/v1/proctoring/submit', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to submit proctoring data:', error);
      // Don't throw - proctoring submission shouldn't block exam submission
      return { success: false, error: error.message };
    }
  }
};
