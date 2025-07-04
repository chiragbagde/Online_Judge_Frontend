import { api } from './api';

export const compilerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Code Execution
    runCode: builder.mutation({
      query: (payload) => ({
        url: 'code/run',
        method: 'POST',
        body: payload,
      }),
    }),
    submitCode: builder.mutation({
      query: (payload) => ({
        url: 'code/submit',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Submission', id: 'LIST' }],
    }),

    // Code Templates & Snippets
    getCodeTemplates: builder.query({
      query: (language) => `code/templates/${language}`,
      providesTags: [{ type: 'CodeTemplate', id: 'LIST' }],
    }),
    saveCodeTemplate: builder.mutation({
      query: (template) => ({
        url: 'code/templates/save',
        method: 'POST',
        body: template,
      }),
      invalidatesTags: [{ type: 'CodeTemplate', id: 'LIST' }],
    }),
    updateCodeTemplate: builder.mutation({
      query: (template) => ({
        url: 'code/templates/update',
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: [{ type: 'CodeTemplate', id: 'LIST' }],
    }),
    deleteCodeTemplate: builder.mutation({
      query: (templateId) => ({
        url: `code/templates/${templateId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'CodeTemplate', id: 'LIST' }],
    }),

    // Code History & Saves
    getCodeHistory: builder.query({
      query: (userId) => `code/history/${userId}`,
      providesTags: [{ type: 'CodeHistory', id: 'LIST' }],
    }),
    saveCode: builder.mutation({
      query: (codeData) => ({
        url: 'code/save',
        method: 'POST',
        body: codeData,
      }),
      invalidatesTags: [{ type: 'CodeHistory', id: 'LIST' }],
    }),
    loadSavedCode: builder.query({
      query: (saveId) => `code/saved/${saveId}`,
      providesTags: (result, error, id) => [{ type: 'SavedCode', id }],
    }),
    deleteSavedCode: builder.mutation({
      query: (saveId) => ({
        url: `code/saved/${saveId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'CodeHistory', id: 'LIST' }],
    }),

    // Language Support & Configuration
    getSupportedLanguages: builder.query({
      query: () => 'code/languages',
      providesTags: [{ type: 'Language', id: 'LIST' }],
    }),
    getLanguageConfig: builder.query({
      query: (language) => `code/languages/${language}/config`,
      providesTags: (result, error, language) => [{ type: 'LanguageConfig', id: language }],
    }),
    updateLanguageConfig: builder.mutation({
      query: (config) => ({
        url: 'code/languages/config',
        method: 'PUT',
        body: config,
      }),
      invalidatesTags: [{ type: 'LanguageConfig', id: 'LIST' }],
    }),

    // Code Analysis & Linting
    analyzeCode: builder.mutation({
      query: (codeData) => ({
        url: 'code/analyze',
        method: 'POST',
        body: codeData,
      }),
    }),
    lintCode: builder.mutation({
      query: (codeData) => ({
        url: 'code/lint',
        method: 'POST',
        body: codeData,
      }),
    }),
    formatCode: builder.mutation({
      query: (codeData) => ({
        url: 'code/format',
        method: 'POST',
        body: codeData,
      }),
    }),

    // Code Execution Environment
    getExecutionEnvironment: builder.query({
      query: () => 'code/environment',
      providesTags: [{ type: 'ExecutionEnvironment', id: 'LIST' }],
    }),
    updateExecutionEnvironment: builder.mutation({
      query: (environment) => ({
        url: 'code/environment',
        method: 'PUT',
        body: environment,
      }),
      invalidatesTags: [{ type: 'ExecutionEnvironment', id: 'LIST' }],
    }),

    // Code Performance & Metrics
    getCodeMetrics: builder.query({
      query: (executionId) => `code/metrics/${executionId}`,
      providesTags: (result, error, id) => [{ type: 'CodeMetrics', id }],
    }),
    getPerformanceStats: builder.query({
      query: (params) => ({
        url: 'code/performance/stats',
        method: 'POST',
        body: params,
      }),
      providesTags: [{ type: 'PerformanceStats', id: 'LIST' }],
    }),

    // Code Sharing & Collaboration
    shareCode: builder.mutation({
      query: (shareData) => ({
        url: 'code/share',
        method: 'POST',
        body: shareData,
      }),
    }),
    getSharedCode: builder.query({
      query: (shareId) => `code/shared/${shareId}`,
      providesTags: (result, error, id) => [{ type: 'SharedCode', id }],
    }),
    updateSharedCode: builder.mutation({
      query: (shareData) => ({
        url: 'code/shared/update',
        method: 'PUT',
        body: shareData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SharedCode', id }],
    }),
    deleteSharedCode: builder.mutation({
      query: (shareId) => ({
        url: `code/shared/${shareId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SharedCode', id: 'LIST' }],
    }),

    // Code Execution Queue
    getExecutionQueue: builder.query({
      query: (userId) => `code/queue/${userId}`,
      providesTags: [{ type: 'ExecutionQueue', id: 'LIST' }],
    }),
    cancelExecution: builder.mutation({
      query: (executionId) => ({
        url: `code/queue/${executionId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'ExecutionQueue', id: 'LIST' }],
    }),

    // Code Debugging & Testing
    debugCode: builder.mutation({
      query: (debugData) => ({
        url: 'code/debug',
        method: 'POST',
        body: debugData,
      }),
    }),
    runTests: builder.mutation({
      query: (testData) => ({
        url: 'code/test',
        method: 'POST',
        body: testData,
      }),
    }),
    getTestResults: builder.query({
      query: (testId) => `code/test/${testId}/results`,
      providesTags: (result, error, id) => [{ type: 'TestResults', id }],
    }),

    // Code Documentation & Help
    getLanguageDocs: builder.query({
      query: (language) => `code/docs/${language}`,
      providesTags: (result, error, language) => [{ type: 'LanguageDocs', id: language }],
    }),
    searchCodeExamples: builder.query({
      query: (searchParams) => ({
        url: 'code/examples/search',
        method: 'POST',
        body: searchParams,
      }),
      providesTags: [{ type: 'CodeExamples', id: 'SEARCH' }],
    }),
    getCodeExample: builder.query({
      query: (exampleId) => `code/examples/${exampleId}`,
      providesTags: (result, error, id) => [{ type: 'CodeExample', id }],
    }),

    // Code Security & Validation
    validateCode: builder.mutation({
      query: (codeData) => ({
        url: 'code/validate',
        method: 'POST',
        body: codeData,
      }),
    }),
    scanCodeSecurity: builder.mutation({
      query: (codeData) => ({
        url: 'code/security/scan',
        method: 'POST',
        body: codeData,
      }),
    }),
    getSecurityReport: builder.query({
      query: (scanId) => `code/security/report/${scanId}`,
      providesTags: (result, error, id) => [{ type: 'SecurityReport', id }],
    }),

    // Code Optimization
    optimizeCode: builder.mutation({
      query: (optimizeData) => ({
        url: 'code/optimize',
        method: 'POST',
        body: optimizeData,
      }),
    }),
    getOptimizationSuggestions: builder.query({
      query: (codeData) => ({
        url: 'code/optimize/suggestions',
        method: 'POST',
        body: codeData,
      }),
      providesTags: [{ type: 'OptimizationSuggestions', id: 'LIST' }],
    }),

    // Code Export & Import
    exportCode: builder.mutation({
      query: (exportData) => ({
        url: 'code/export',
        method: 'POST',
        body: exportData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    importCode: builder.mutation({
      query: (importData) => ({
        url: 'code/import',
        method: 'POST',
        body: importData,
      }),
    }),

    // Code Settings & Preferences
    getUserCodeSettings: builder.query({
      query: (userId) => `code/settings/${userId}`,
      providesTags: [{ type: 'CodeSettings', id: 'LIST' }],
    }),
    updateCodeSettings: builder.mutation({
      query: (settings) => ({
        url: 'code/settings/update',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: [{ type: 'CodeSettings', id: 'LIST' }],
    }),

    // Code Statistics & Analytics
    getCodeStats: builder.query({
      query: (userId) => `code/stats/${userId}`,
      providesTags: [{ type: 'CodeStats', id: 'LIST' }],
    }),
    getGlobalCodeStats: builder.query({
      query: () => 'code/stats/global',
      providesTags: [{ type: 'GlobalCodeStats', id: 'LIST' }],
    }),
  }),
});

export const {
  // Code Execution
  useRunCodeMutation,
  useSubmitCodeMutation,

  // Code Templates & Snippets
  useGetCodeTemplatesQuery,
  useSaveCodeTemplateMutation,
  useUpdateCodeTemplateMutation,
  useDeleteCodeTemplateMutation,

  // Code History & Saves
  useGetCodeHistoryQuery,
  useSaveCodeMutation,
  useLoadSavedCodeQuery,
  useDeleteSavedCodeMutation,

  // Language Support & Configuration
  useGetSupportedLanguagesQuery,
  useGetLanguageConfigQuery,
  useUpdateLanguageConfigMutation,

  // Code Analysis & Linting
  useAnalyzeCodeMutation,
  useLintCodeMutation,
  useFormatCodeMutation,

  // Code Execution Environment
  useGetExecutionEnvironmentQuery,
  useUpdateExecutionEnvironmentMutation,

  // Code Performance & Metrics
  useGetCodeMetricsQuery,
  useGetPerformanceStatsQuery,

  // Code Sharing & Collaboration
  useShareCodeMutation,
  useGetSharedCodeQuery,
  useUpdateSharedCodeMutation,
  useDeleteSharedCodeMutation,

  // Code Execution Queue
  useGetExecutionQueueQuery,
  useCancelExecutionMutation,

  // Code Debugging & Testing
  useDebugCodeMutation,
  useRunTestsMutation,
  useGetTestResultsQuery,

  // Code Documentation & Help
  useGetLanguageDocsQuery,
  useSearchCodeExamplesQuery,
  useGetCodeExampleQuery,

  // Code Security & Validation
  useValidateCodeMutation,
  useScanCodeSecurityMutation,
  useGetSecurityReportQuery,

  // Code Optimization
  useOptimizeCodeMutation,
  useGetOptimizationSuggestionsQuery,

  // Code Export & Import
  useExportCodeMutation,
  useImportCodeMutation,

  // Code Settings & Preferences
  useGetUserCodeSettingsQuery,
  useUpdateCodeSettingsMutation,

  // Code Statistics & Analytics
  useGetCodeStatsQuery,
  useGetGlobalCodeStatsQuery,
} = compilerApi; 