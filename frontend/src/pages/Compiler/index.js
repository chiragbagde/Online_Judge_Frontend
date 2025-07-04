import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  useTheme,
  Paper,
  Stack,
  Fade,
  Alert,
  CircularProgress,
  Snackbar
} from "@mui/material";
import LanguageSelect from "../../components/LanguageSelect";
import { CODE_SNIPPETS } from "../../data/snippets";
import { 
  PlayArrow, 
  RestartAlt, 
  ContentCopy, 
  Code as CodeIcon,
  Refresh as RefreshIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from "@mui/icons-material";
import { useRunCodeMutation, useGetSupportedLanguagesQuery } from "../../apis/compilerApi";
import { toast } from "react-toastify";

const Compiler = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("cpp");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const borderColor = theme.palette.divider;
  const backgroundColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;

  // RTK Query hooks
  const [runCode, { isLoading: loading, error: runError }] = useRunCodeMutation();
  const { 
    data: supportedLanguages, 
    isLoading: languagesLoading,
    error: languagesError 
  } = useGetSupportedLanguagesQuery();

  editor.defineTheme("customTheme", {
    base: isDark ? "vs" : "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background":
        backgroundColor.length === 4
          ? `#${backgroundColor[1]}${backgroundColor[1]}${backgroundColor[2]}${backgroundColor[2]}${backgroundColor[3]}${backgroundColor[3]}`
          : backgroundColor
    },
  });

  useEffect(() => {
    editor.setTheme("customTheme");
  }, [isDark, backgroundColor]);

  const handleSubmit = async () => {
    try {
      const payload = { lang, code, input };
      const result = await runCode(payload).unwrap();
      setOutput(result.output);
      setShowSuccess(true);
      toast.success('Code executed successfully!');
    } catch (error) {
      console.error('Code execution error:', error);
      setOutput(error.data?.message || 'An error occurred while running the code');
      setShowError(true);
      toast.error('Failed to execute code');
    }
  };

  const handleReset = () => {
    setCode(CODE_SNIPPETS[lang]);
    setInput("");
    setOutput("");
    setShowSuccess(false);
    setShowError(false);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success('Output copied to clipboard!');
  };

  const handleClearOutput = () => {
    setOutput("");
    setShowSuccess(false);
    setShowError(false);
  };

  useEffect(() => {
    if(lang){
      setCode(CODE_SNIPPETS[lang]);
    }
  }, [lang]);

  const setLanguage = (value) => {
    setLang(value);
    setCode(CODE_SNIPPETS[value]);
  };

  const getOutputIcon = () => {
    if (showSuccess) return <SuccessIcon sx={{ color: 'success.main' }} />;
    if (showError) return <ErrorIcon sx={{ color: 'error.main' }} />;
    return null;
  };

  const getOutputColor = () => {
    if (showSuccess) return 'success.main';
    if (showError) return 'error.main';
    return 'text.primary';
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        p: { xs: 1, md: 4 },
        pt: 0,
        pb: 10,
        background: isDark 
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Fade in timeout={800}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
              <CodeIcon sx={{ fontSize: 40, color: '#ffd700' }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                Online Compiler
              </Typography>
            </Stack>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Write, run, and debug code in your favorite language!
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              justifyContent: "center",
              width: "100%",
              height: { xs: "auto", md: "85vh" },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: "60%" },
                height: { xs: 500, md: "100%" },
                background: isDark 
                  ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  height: "4rem",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: `1px solid ${borderColor}`,
                  px: 2,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: textColor,
                    flexGrow: 1,
                    letterSpacing: 0.5,
                  }}
                >
                  Main.{lang}
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <LanguageSelect
                    sx={{
                      height: "100%",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    lang={lang}
                    setLang={setLanguage}
                    disabled={languagesLoading}
                  />
                </Box>
                <Button
                  sx={{ 
                    ml: 2, 
                    fontWeight: 700, 
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: theme.shadows[4],
                    },
                    transition: 'all 0.2s ease',
                  }}
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Running..." : "Run"}
                </Button>
                <Button
                  sx={{ 
                    ml: 2, 
                    fontWeight: 700, 
                    borderRadius: 2,
                    borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                    color: isDark ? 'white' : 'text.primary',
                    '&:hover': {
                      borderColor: isDark ? 'white' : 'text.primary',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                    }
                  }}
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              </Box>

              <Box sx={{ flex: 1, p: 1, minHeight: 0 }}>
                <Editor
                  value={code}
                  height="100%"
                  language={lang}
                  defaultValue={CODE_SNIPPETS[lang]}
                  onChange={setCode}
                  theme={isDark ? "vs-dark" : "vs-light"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    theme: isDark ? "vs-dark" : "vs-light",
                    backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    selectOnLineNumbers: true,
                    folding: true,
                    foldingStrategy: 'indentation',
                    showFoldingControls: 'always',
                    disableLayerHinting: true,
                    scrollbar: {
                      useShadows: false,
                      verticalHasArrows: true,
                      horizontalHasArrows: true,
                      vertical: 'visible',
                      horizontal: 'visible',
                      verticalScrollbarSize: 17,
                      horizontalScrollbarSize: 17,
                      arrowSize: 30
                    }
                  }}
                />
              </Box>

              <Box
                sx={{
                  height: 120,
                  p: 2,
                  borderTop: `1px solid ${borderColor}`,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Typography sx={{ color: textColor, mb: 1, fontWeight: 600 }}>
                  Input
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter input here..."
                  multiline
                  rows={2}
                  variant="outlined"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  sx={{ 
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    }
                  }}
                  disabled={loading}
                />
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", md: "40%" },
                height: { xs: 300, md: "100%" },
                background: isDark 
                  ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  height: "4rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${borderColor}`,
                  px: 2,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getOutputIcon()}
                  <Typography
                    sx={{ 
                      fontWeight: 700, 
                      color: getOutputColor(), 
                      letterSpacing: 0.5 
                    }}
                  >
                    Output
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyOutput}
                    sx={{ 
                      mr: 1, 
                      borderRadius: 2,
                      borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                      color: isDark ? 'white' : 'text.primary',
                      '&:hover': {
                        borderColor: isDark ? 'white' : 'text.primary',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                      }
                    }}
                    disabled={!output}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearOutput}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                      color: isDark ? 'white' : 'text.primary',
                      '&:hover': {
                        borderColor: isDark ? 'white' : 'text.primary',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                      }
                    }}
                    disabled={!output}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>

              <Box
                component="textarea"
                value={output}
                readOnly
                sx={{
                  flex: 1,
                  p: 2,
                  width: "100%",
                  bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  color: getOutputColor(),
                  border: "none",
                  overflow: "auto",
                  outline: "none",
                  fontFamily: "monospace",
                  fontSize: 16,
                  resize: "none",
                  lineHeight: 1.5,
                }}
              />
            </Paper>
          </Box>

          {runError && (
            <Snackbar
              open={showError}
              autoHideDuration={6000}
              onClose={() => setShowError(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert 
                onClose={() => setShowError(false)} 
                severity="error" 
                sx={{ width: '100%' }}
              >
                {runError.data?.message || 'Failed to execute code'}
              </Alert>
            </Snackbar>
          )}

          {/* {languagesError && (
            <Snackbar
              open={!!languagesError}
              autoHideDuration={6000}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert 
                severity="error" 
                sx={{ width: '100%' }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    startIcon={<RefreshIcon />}
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                }
              >
                Failed to load supported languages
              </Alert>
            </Snackbar>
          )} */}
        </Container>
      </Fade>
    </Box>
  );
};

export default Compiler;
