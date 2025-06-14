import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Editor, useMonaco } from "@monaco-editor/react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Box, Typography, Paper, useTheme } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import LanguageSelect from "../../components/LanguageSelect";
import { toast } from "react-toastify";
import { urlConstants } from "../../apis";
import { getConfig } from "../../utils/getConfig";
import { CODE_SNIPPETS } from "../../data/snippets";
import * as monaco from 'monaco-editor';

import { loader } from '@monaco-editor/react';

loader.config({ monaco });

const ColorButton = styled(Button)({
  color: "#fff",
  backgroundColor: "#1976d2",
  fontWeight: 600,
  borderRadius: 2,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#115293",
  },
});

const Compiler = ({
  setOutput,
  setLoading,
  code,
  setCode,
  setDesc,
  id,
  c_id,
}) => {
  const [lang, setLang] = useState("cpp");
  const [testCase, setTestCase] = useState("");
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();

  const isLightMode = theme.palette.mode === "light";
  const borderColor = theme.palette.border?.secondary ?? "#ccc";
  const backgroundColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;

  // get monaco instance
  const monaco = useMonaco();

  // once monaco loads, define & set our custom theme
  useEffect(() => {
    if (!monaco) return;

    monaco.editor.defineTheme("customTheme", {
      base: isLightMode ? "vs" : "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background":
          backgroundColor.length === 4
            ? `#${backgroundColor[1]}${backgroundColor[1]}${backgroundColor[2]}${backgroundColor[2]}${backgroundColor[3]}${backgroundColor[3]}`
            : backgroundColor,
      },
    });

    monaco.editor.setTheme("customTheme");
  }, [monaco, isLightMode, backgroundColor]);

  // load default snippet on language change
  useEffect(() => {
    setCode(CODE_SNIPPETS[lang]);
  }, [lang, setCode]);

  const handleRun = async () => {
    if (!code) {
      toast.error("No code detected. Please add some code before submitting.");
      return;
    }
    setLoading(true);
    try {
      const payload = { lang, code, input: testCase };
      const { data } = await axios.post(
        urlConstants.runCode,
        payload,
        getConfig()
      );
      setOutput(data.output);
      setDesc(false);
    } catch (e) {
      setOutput("There was an error while running your code");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code) {
      toast.error("No code detected. Please add some code before submitting.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        lang,
        code,
        p_id: id,
        u_id: user?.id,
        c_id,
        input: testCase,
      };
      const { data } = await axios.post(
        urlConstants.submitCode,
        payload,
        getConfig()
      );
      setOutput(data.message);
      setDesc(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor,
        borderRadius: 2,
        boxShadow: "0 2px 12px #0001",
        border: `1px solid ${borderColor}`,
        p: 0,
      }}
    >
      {/* Toolbar */}
      <Box sx={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${borderColor}`, px: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: textColor, flexGrow: 1 }}>
          Main.{lang}
        </Typography>
        <LanguageSelect
          lang={lang}
          setLang={setLang}
          sx={{ ml: 2, height: "100%", background: "transparent" }}
        />
        <ColorButton sx={{ ml: 2 }} onClick={handleRun}>
          Run
        </ColorButton>
        <ColorButton
          sx={{ ml: 2, backgroundColor: "#43a047", "&:hover": { backgroundColor: "#357a38" } }}
          onClick={handleSubmit}
        >
          Submit
        </ColorButton>
      </Box>

      {/* Editor */}
      <Box sx={{ flex: 1, p: 2, borderBottom: `1px solid ${borderColor}` }}>
      <Editor
  language={lang}
  value={code}
  onChange={setCode}
  theme={isLightMode ? "vs-light" : "vs-dark"}
  options={{ automaticLayout: true, minimap: { enabled: false } }}
  beforeMount={() => {
    // set up the global env for all workers
    window.MonacoEnvironment = {
      getWorkerUrl: (_moduleId, label) => {
        const base = "https://unpkg.com/monaco-editor@0.34.1/min/vs";
        switch (label) {
          case "json":
            return `${base}/language/json/json.worker.js`;
          case "css":
          case "scss":
          case "less":
            return `${base}/language/css/css.worker.js`;
          case "html":
          case "razor":
            return `${base}/language/html/html.worker.js`;
          case "typescript":
          case "javascript":
            return `${base}/language/typescript/ts.worker.js`;
          default:
            return `${base}/editor/editor.worker.js`;
        }
      }
    };
  }}
/>

      </Box>

      {/* Console / Testcase */}
      <Box
        sx={{
          minHeight: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          borderTop: `1px solid ${borderColor}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontWeight={600}>Console</Typography>
          <ArrowDropUpIcon />
        </Stack>
        <TextField
          value={testCase}
          onChange={(e) => setTestCase(e.target.value)}
          variant="outlined"
          multiline
          rows={4}
          sx={{ width: 500, fontSize: 14, borderRadius: 1 }}
        />
      </Box>
    </Paper>
  );
};

export default Compiler;
