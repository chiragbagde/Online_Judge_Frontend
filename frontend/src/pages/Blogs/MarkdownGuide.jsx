import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  useTheme,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

const MarkdownGuide = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const markdownExamples = [
    {
      title: "Headings",
      code: `# Heading 1
## Heading 2  
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`
    },
    {
      title: "Text Formatting",
      code: `**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
\`Inline code\`
> Blockquote`
    },
    {
      title: "Lists",
      code: `### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

### Ordered List
1. First item
2. Second item
   1. Nested item
   2. Another nested item
3. Third item

### Task List
- [x] Completed task
- [ ] Uncompleted task
- [x] Another completed task`
    },
    {
      title: "Links and Images",
      code: `[Link text](https://example.com)
[Link with title](https://example.com "This is a title")

![Alt text](https://via.placeholder.com/300x200/007bff/ffffff?text=Sample+Image)
![Image with title](https://via.placeholder.com/200x150/28a745/ffffff?text=Another+Image "Image Title")`
    },
    {
      title: "Tables",
      code: `| Feature | Description | Status |
|---------|-------------|---------|
| Syntax Highlighting | Code blocks with language support | ✅ |
| Tables | GitHub-style tables | ✅ |
| Task Lists | Interactive checkboxes | ✅ |
| Math | LaTeX math expressions | ❌ |

### Aligned Tables
| Left | Center | Right |
|:-----|:------:|------:|
| Left aligned | Center aligned | Right aligned |
| Text | Text | Text |`
    },
    {
      title: "JavaScript Code Block",
      code: `\`\`\`javascript
// Example JavaScript function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Usage example
const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);

// Modern ES6+ syntax
const asyncFunction = async (data) => {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};
\`\`\``
    },
    {
      title: "Python Code Block",
      code: `\`\`\`python
# Example Python class
class DataProcessor:
    def __init__(self, data):
        self.data = data
        self.processed = False
    
    def process(self):
        """Process the data using list comprehension"""
        if not self.processed:
            self.data = [x * 2 for x in self.data if x > 0]
            self.processed = True
        return self.data
    
    def __str__(self):
        return f"DataProcessor(processed={self.processed}, items={len(self.data)})"

# Usage
processor = DataProcessor([1, -2, 3, 4, -5])
result = processor.process()
print(f"Result: {result}")  # Result: [2, 6, 8]

# Decorators and context managers
from functools import wraps
import time

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"
\`\`\``
    },
    {
      title: "C++ Code Block",
      code: `\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <memory>

// Example C++ class with templates
template<typename T>
class SmartArray {
private:
    std::vector<T> data;
    
public:
    SmartArray() = default;
    SmartArray(std::initializer_list<T> init) : data(init) {}
    
    void push_back(const T& value) {
        data.push_back(value);
    }
    
    void sort() {
        std::sort(data.begin(), data.end());
    }
    
    T& operator[](size_t index) {
        return data[index];
    }
    
    size_t size() const {
        return data.size();
    }
    
    // Range-based for loop support
    auto begin() { return data.begin(); }
    auto end() { return data.end(); }
    auto begin() const { return data.begin(); }
    auto end() const { return data.end(); }
};

int main() {
    SmartArray<int> arr{5, 2, 8, 1, 9};
    
    std::cout << "Original: ";
    for (const auto& item : arr) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
    
    arr.sort();
    
    std::cout << "Sorted: ";
    for (size_t i = 0; i < arr.size(); ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
\`\`\``
    },
    {
      title: "JSON and Configuration",
      code: `\`\`\`json
{
  "name": "my-blog-app",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.15.1"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  }
}
\`\`\`

\`\`\`yaml
# Docker Compose configuration
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - database
  
  database:
    image: mongodb:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
\`\`\``
    },
    {
      title: "Advanced Features",
      code: `### Horizontal Rule
---

### Escape Characters
You can escape special characters: \\*literal asterisks\\*

### HTML Support (if enabled)
<details>
<summary>Click to expand</summary>

This content is hidden by default and can be expanded by clicking the summary.

- Hidden list item 1
- Hidden list item 2

</details>

### Math Expressions (if supported)
Inline math: $E = mc^2$

Block math:
$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

### Keyboard Shortcuts
Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy
Press <kbd>Cmd</kbd> + <kbd>V</kbd> to paste on Mac

### Emojis
:rocket: :fire: :heart: :thumbsup: :warning:
🚀 🔥 ❤️ 👍 ⚠️`
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0a0e27 0%, #1a1d35 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          sx={{
            background: isDark 
              ? 'linear-gradient(145deg, rgba(30,30,30,0.95) 0%, rgba(40,40,40,0.95) 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            p: 4
          }}
        >
          <Stack spacing={4}>
            <Box textAlign="center">
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                Markdown Guide
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Learn how to format your blog posts with Markdown
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip label="GitHub Flavored Markdown" color="primary" />
                <Chip label="Syntax Highlighting" color="success" />
                <Chip label="Tables Support" color="info" />
                <Chip label="Task Lists" color="warning" />
              </Stack>
            </Box>

            <Divider />

            {markdownExamples.map((example, index) => (
              <Card 
                key={index}
                sx={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, borderBottom: `1px solid ${isDark ? 'grey.800' : 'grey.200'}` }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {example.title}
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{
                      p: 3,
                      '& pre': {
                        backgroundColor: isDark ? '#0d1117' : '#f6f8fa',
                        padding: '1rem',
                        borderRadius: 2,
                        overflowX: 'auto',
                        margin: '1rem 0',
                        border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                        fontSize: '0.875rem',
                        lineHeight: 1.45,
                        '& code': {
                          fontFamily: '"SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", monospace',
                          fontSize: 'inherit',
                          lineHeight: 'inherit',
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: 0,
                        }
                      },
                      '& code': {
                        backgroundColor: isDark ? 'rgba(110,118,129,0.4)' : 'rgba(175,184,193,0.2)',
                        padding: '0.2em 0.4em',
                        borderRadius: 3,
                        fontSize: '85%',
                        fontFamily: '"SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", monospace',
                        fontWeight: 400,
                      },
                      '& blockquote': {
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        padding: '1rem',
                        margin: '1rem 0',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '0 8px 8px 0',
                      },
                      '& table': {
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '1rem 0',
                        border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        '& th, & td': {
                          border: `1px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                          padding: '0.75rem',
                          textAlign: 'left',
                        },
                        '& th': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          fontWeight: 600,
                        },
                        '& tr:nth-of-type(even)': {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                        }
                      },
                      '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        margin: '1rem 0',
                      },
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        marginTop: '1.5rem',
                        marginBottom: '0.75rem',
                        fontWeight: 600,
                        '&:first-child': {
                          marginTop: 0
                        }
                      },
                      '& ul, & ol': {
                        paddingLeft: '1.5rem',
                        margin: '1rem 0',
                      },
                      '& hr': {
                        border: 'none',
                        borderTop: `2px solid ${isDark ? 'grey.800' : 'grey.200'}`,
                        margin: '2rem 0',
                        borderRadius: 1,
                      },
                      '& kbd': {
                        backgroundColor: isDark ? '#21262d' : '#f6f8fa',
                        border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`,
                        borderRadius: 3,
                        boxShadow: `inset 0 -1px 0 ${isDark ? '#30363d' : '#d0d7de'}`,
                        color: isDark ? '#f0f6fc' : '#24292f',
                        fontSize: '11px',
                        fontFamily: '"SFMono-Regular", "Consolas", "Liberation Mono", "Menlo", monospace',
                        lineHeight: '10px',
                        padding: '3px 5px',
                        verticalAlign: 'middle',
                      }
                    }}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    >
                      {example.code}
                    </ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            ))}

            <Card 
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Ready to Start Writing?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Use these examples as a reference while creating your blog posts. The editor supports all these features and more!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tip: You can switch between Write and Preview tabs in the editor to see your formatted content in real-time.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default MarkdownGuide; 