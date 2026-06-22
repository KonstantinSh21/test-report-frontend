export class ApiAdapter {
  static toPipeLineModel(apiData) {
    return {
      getState() {
        return {
          passed: apiData.passed,
          total: apiData.total,
          failed: apiData.failed,
          tests: (apiData.tests || []).map(test => ({
            testName: test.name,
            status: test.status,
            file: test.file || 'general',
            testDetails: {
              error: test.error || '',
              locator: test.locator || '',
              expected: test.expected || '',
              received: test.received || '',
              callLog: test.call_log || []
            }
          }))
        };
      },
      
      getByFileMap() {
        const map = new Map();
        const tests = this.getState().tests;
        
        for (const test of tests) {
          const fileName = test.file;
          if (!map.has(fileName)) {
            map.set(fileName, new Map());
          }
          map.get(fileName).set(test.testName, test);
        }
        
        return map;
      }
    };
  }
  
  static toApiFormat(pipeLineModel) {
    const state = pipeLineModel.getState ? pipeLineModel.getState() : pipeLineModel;
    
    return {
      passed: state.passed,
      total: state.total,
      failed: state.failed,
      tests: (state.tests || []).map(test => ({
        testName: test.testName,
        status: test.status,
        file: test.file,
        testDetails: test.testDetails || {}
      }))
    };
  }
}