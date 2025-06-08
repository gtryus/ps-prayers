import { useMemo, useState, useEffect } from "react";
import prayingLogo from "./assets/praying.png";
import etbLogo from "/etb-sum-25-wb.png";
import "./App.css";
import {
  Stack,
  Link,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import SelectSession from "./Components/SelectSession";
import { sessionData } from "./data/sessionData.ts";
import { questions } from "./data/questions.ts";
import Question from "./Components/Question.tsx";

const unit = "su25"

const lookupUrl = `https://www.biblegateway.com/passage/?search=`;
const versionUrl = `&version=NLT`;

function App() {
  const [sesNum, setSesNum] = useState("2");
  const [responses, setResponses] = useState<string[]>([]);
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDarkMode? "dark" : "light",
      },
    });
  }, [isDarkMode]);

  const chapter = useMemo(() => {
    const session = sessionData.find(s => s.value === parseInt(sesNum));
    return session?.verses.split(":")[0];
  }, [sesNum]);

  const verse = useMemo(() => {
    const session = sessionData.find(s => s.value === parseInt(sesNum));
    return session?.verses.split(":")[1];
  }, [sesNum]);

  const url = useMemo(() => {
    return `${lookupUrl}${chapter || "119"}:${verse || "1-16"}${versionUrl}`;
  }, [chapter, verse]);

  const handleQuestionChange = (ses: string, num: string, value: string) => {
    localStorage.setItem(`${unit}-${ses}-${num}`, value); // Save question to local storage
  };

  useEffect(() => {
    // Load responses from local storage when the component mounts
    const loadedResponses: string[] = [];
    for (let i = 0; i < questions.length; i++) {
      const response = localStorage.getItem(`${unit}-${sesNum}-${i}`);
      loadedResponses.push(response || "");
    }
    setResponses(loadedResponses);
  }, [sesNum]);

  useEffect(() => {
    const today = new Date();
    // Find the closest session to today
    const closestSession = sessionData.reduce((prev, curr) => {
      const prevDate = new Date(prev.date);
      const currDate = new Date(curr.date);
      const prevDiff = Math.abs(prevDate.getTime() - today.getTime());
      const currDiff = Math.abs(currDate.getTime() - today.getTime());
      return currDiff < prevDiff ? curr : prev;
    });
    setSesNum(closestSession.value.toString());
  }, []);

  return (
    <>
      <div>
        <a href="https://GoExploreTheBible.com/adults" target="_blank">
          <img src={etbLogo} className="logo" alt="Vite logo" />
        </a>
        <a
          href="https://explorethebible.lifeway.com/category/blog/adults/"
          target="_blank"
        >
          <img src={prayingLogo} className="logo" alt="React logo" />
        </a>
      </div>
      
      <div className="card">
        <ThemeProvider theme={theme}>
          <Stack spacing={2} direction="column" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Praying Scripture from Psalms
          </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <SelectSession value={sesNum} onChange={setSesNum} />
              <Link href={url} target="_blank">
                <LinkIcon />
              </Link>
            </Stack>
            {questions.map((question, index) => (
              <Question
                key={`q-${index}`}
                label={question}
                value={responses[index] || ""}
                onChange={value =>
                  handleQuestionChange(sesNum, index.toString(), value)
                }
              />
            ))}
          </Stack>
        </ThemeProvider>
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  );
}

export default App;
