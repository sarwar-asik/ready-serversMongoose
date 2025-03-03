import dotenv from 'dotenv';
import { Request } from 'express';
import * as fs from 'fs';
import * as os from 'os';
import * as osUtils from 'os-utils';
import * as path from 'path';
import config from '../config';
import { listLogFiles } from '../helpers/listLogFiles';

dotenv.config();

const logFilePath = path.resolve(__dirname, '../../app.log');

// Interface for log entries
type LogEntry = {
  timestamp: string;
  message: string;
  statusCode: string;
  errorPath: string;
};

// Function to read and parse log file
function readLogFile(): LogEntry[] {
  try {
    const logData = fs.readFileSync(logFilePath, 'utf8');
    const logEntries: LogEntry[] = logData
      .split('\n')
      .filter(entry => entry.trim() !== '')
      .map(entry => {
        try {
          const regex =
            /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z) \[ERROR\] (.*) \(Status Code: (\d{3})\) \(Error Path: (.*)\)/;
          const matches = entry.match(regex);
          if (!matches) return null;

          const timestamp = new Date(matches[1]).toLocaleString();
          const message = matches[2];
          const statusCode = matches[3];
          const errorPath = matches[4];

          if (errorPath.includes('/favicon.ico')) return null;

          return {
            timestamp,
            message,
            statusCode,
            errorPath,
          };
        } catch (error: any) {
          return null;
        }
      })
      .filter(entry => entry !== null) as LogEntry[];

    return logEntries;
  } catch (error: any) {
    return [];
  }
}

// Function to generate HTML for log table
// eslint-disable-next-line no-unused-vars
function generateLogTable(logEntries: LogEntry[]): string {
  const errorLogs = listLogFiles('errors');
  const successLogs = listLogFiles('success');

  const errorLogLinks = errorLogs
    .map(
      file =>
        `<a href="/logs/errors/${file}" target="_blank" class="log-link">${file}</a>`
    )
    .join('<br>');
  const successLogLinks = successLogs
    .map(
      file =>
        `<a href="/logs/success/${file}" target="_blank" class="log-link">${file}</a>`
    )
    .join('<br>');

  return `
    <div class="log-container">
      <div class="log-section">
        <h3 style="color: #dc3545;">Error Logs</h3>
        <div class="log-links error-logs">
          ${errorLogLinks}
        </div>
      </div>
      <div class="log-section">
        <h3 style="color: #28a745;">Success Logs</h3>
        <div class="log-links success-logs">
          ${successLogLinks}
        </div>
      </div>
      <style>
        .log-container {
          display: flex;
          gap: 2rem;
          margin: 1rem 0;
        }
        .log-section {
          flex: 1;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .log-links {
          margin-top: 1rem;
        }
        .log-link {
          display: inline-block;
          color: #0066cc;
          text-decoration: none;
          margin: 0.25rem 0;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .log-link:hover {
          background-color: #e0e0e0;
          text-decoration: underline;
        }
        .error-logs .log-link {
          color: #dc3545;
        }
        .success-logs .log-link {
          color: #28a745;
        }
      </style>
    </div>
  `;
}

// Interface for response times
type ResponseTime = {
  route: string;
  time: number;
  label: string;
};

// Function to generate response times table
function generateResponseTimesTable(responseTimes: ResponseTime[]): string {
  if (responseTimes.length === 0) {
    return '<p>No response time data available.</p>';
  }

  let tableHtml = `
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Method</th>
            <th>Response Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  `;

  responseTimes.forEach(entry => {
    const statusClass =
      entry.label === 'High' ? 'status-warning' : 'status-success';
    tableHtml += `
      <tr>
        <td>${entry.route}</td>
        <td>GET</td>
        <td>${entry.time}ms</td>
        <td><span class="status ${statusClass}"></span>${entry.label === 'High' ? 'Warning' : 'OK'
      }</td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  return tableHtml;
}

// Function to get CPU usage and generate HTML
function generateCpuUsageHtml(): Promise<string> {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    osUtils.cpuUsage(function (v) {
      const totalCores = os.cpus().length;
      const cpuUsagePercentage = v * 100;
      const usedCores = Math.ceil((cpuUsagePercentage / 100) * totalCores);
      const idleCores = totalCores - usedCores;
      // console.log(idleCores,'idleCores')

      resolve(`
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${cpuUsagePercentage.toFixed(2)}%</div>
            <div class="metric-label">Total Usage</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${usedCores}/${totalCores}</div>
            <div class="metric-label">Active Cores</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${idleCores}</div>
            <div class="metric-label">Idle Cores</div>
          </div>
        </div>
      `);
    });
  });
}

// Function to format uptime
function formatUptime(uptimeInSeconds: number): string {
  const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
  const hours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}


let lastServerUpdateTime = new Date();
export function updateServerTime() {
  lastServerUpdateTime = new Date();
}
// Function to format time ago
function formatTimeAgo(date: Date): string {
  /// console.log(date, 'dddddddddddd')
  /// console.log(date.getTime(), 'date.getTime()')
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  // console.log(seconds, 'seconds')

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  /// console.log(`${Math.floor(seconds / 86400)}d ago`)
  return `${Math.floor(seconds / 86400)}d ago`;
}


// Function to generate server metadata
function generateServerMetadata(): {
  cpuName: string;
  speed: string;
  uptime: string;
  lastUpdate: string;
} {
  const hostname = os.hostname();
  // console.log(hostname,'hostname')
  const uptimeSeconds = os.uptime();

  // console.log(os.machine(),"machine",os.cpus()[0].model,"cpuModel",os.cpus()[0].speed,"cpuSpeed",os.cpus()[0].times,"cpuTimes")

  // You can store this in a variable and update it when server state changes

  // Generate a consistent server ID based on hostname
  // const serviceID = `PRD-${hostname.slice(0, 3).toUpperCase()}-${Math.abs(hostname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000).toString().padStart(3, '0')}`;

  // Get speed from environment or default


  // console.log(uptimeSeconds,'uptimeSeconds')
  const speedReadable = `${os.cpus()[0].speed} MHz`;
  return {
    cpuName: hostname + " -" + os.cpus()[0].model,
    speed: speedReadable,
    uptime: formatUptime(uptimeSeconds),
    lastUpdate: formatTimeAgo(lastServerUpdateTime)
  };
}

// Function to generate the HTML page
async function serverMonitorPage(
  req: Request,
  responseTimes: ResponseTime[]
): Promise<string> {
  // console.log(responseTimes, 'responseTimes')
  const logEntries = readLogFile();
  // console.log(listLogFiles("errors"), 'listLogFiles')
  // console.log( listLogFiles("success"), 'listLogFiles')
  const logTableHtml = generateLogTable(logEntries);
  // console.log(responseTimes, 'responseTimes');
  const responseTimesTableHtml = generateResponseTimesTable(responseTimes);
  const cpuUsageHtml = await generateCpuUsageHtml();
  const serverMeta = generateServerMetadata();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>System Monitor</title>
        <style>
          :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #12151f;
            --accent: #00ffd5;
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --border: #1e2433;
            --space-sm: 0.5rem;
            --space-md: 1rem;
            --space-lg: 2rem;
            --glow: 0 0 10px var(--accent);
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'JetBrains Mono', monospace;
            background: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            padding: var(--space-md);
            line-height: 1.6;
          }

          .container {
            max-width: 1400px;
            margin: 0 auto;
          }

          .header {
            margin-bottom: var(--space-lg);
            padding: var(--space-md);
            border: 1px solid var(--border);
            background: var(--bg-secondary);
            position: relative;
            overflow: hidden;
          }

          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--accent);
            box-shadow: var(--glow);
            animation: scan 2s linear infinite;
          }

           
          .header-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-md);
            margin-top: var(--space-md);
            padding-top: var(--space-md);
            border-top: 1px solid var(--border);
        }

        .meta-item {
            display: flex;
            flex-direction: column;
        }

        .meta-label {
            color: var(--text-secondary);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .meta-value {
            color: var(--accent);
            font-size: 1rem;
            font-weight: bold;
            letter-spacing: 0.05em;
        }

        .header-decoration {
            position: absolute;
            top: 0;
            right: 0;
            font-family: monospace;
            font-size: 0.75rem;
            color: var(--border);
            opacity: 0.3;
            padding: var(--space-sm);
        }

          @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
          }
                    
          @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .tabs {
            margin-bottom: var(--space-lg);
          }

          .tab-nav {
            display: flex;
            gap: 1px;
            margin-bottom: -1px;
          }

          .tab-button {
            padding: var(--space-md) var(--space-lg);
            background: var(--bg-secondary);
            color: var(--text-secondary);
            border: 1px solid var(--border);
            cursor: pointer;
            flex: 1;
            text-align: center;
            font-family: inherit;
            font-size: inherit;
            position: relative;
            overflow: hidden;
          }

          .tab-button:hover {
            color: var(--accent);
          }

          .tab-button.active {
            background: var(--bg-primary);
            color: var(--accent);
            border-bottom-color: var(--bg-primary);
          }

          .tab-button.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--accent);
            box-shadow: var(--glow);
          }

          .tab-content {
            display: none;
            padding: var(--space-lg);
            background: var(--bg-primary);
            border: 1px solid var(--border);
          }

          .tab-content.active {
            display: block;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--space-md);
          }

          .metric-card {
            background: var(--bg-secondary);
            padding: var(--space-md);
            border: 1px solid var(--border);
            position: relative;
          }

          .metric-value {
            font-size: 2rem;
            color: var(--accent);
            text-shadow: var(--glow);
          }

          .metric-label {
            color: var(--text-secondary);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }

          .table-wrapper {
            overflow-x: auto;
          }

          .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
          }

          .data-table th,
          .data-table td {
            padding: var(--space-sm) var(--space-md);
            text-align: left;
            border-bottom: 1px solid var(--border);
          }

          .data-table th {
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }

          .data-table tr:hover {
            background: rgba(0, 255, 213, 0.05);
          }

          .status {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: var(--space-sm);
          }
          
          .server-status{
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.875rem;
            color: #85EA2D;
          }

          .status-success { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
          .status-warning { background: #ffbb00; box-shadow: 0 0 10px #ffbb00; }
          .status-error { background: #ff0055; box-shadow: 0 0 10px #ff0055; }

          @media (max-width: 768px) {
            .tab-button {
              padding: var(--space-sm);
              font-size: 0.875rem;
            }
            .data-table { font-size: 0.75rem; }
            .metric-value { font-size: 1.5rem; }
          }
        </style>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const tabs = document.querySelectorAll('.tab-button');
            const contents = document.querySelectorAll('.tab-content');
            
            // Show first tab by default
            tabs[0].classList.add('active');
            contents[0].classList.add('active');
            
            tabs.forEach((tab, index) => {
              tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                contents[index].classList.add('active');
              });
            });
          });
        </script>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <div class="header-decoration">
                SYS::0x7f4a2c3d1b8e
            </div>
            <div class="header-content">
                <div class="header-title">
                    <h1>SYSTEM MONITOR_</h1>
                    <div class="server-status">
                        <span class="status-dot"></span>
                        <span>RUNNING.....</span>
                    </div>
                </div>
                <p style="text-transform: uppercase;">${config?.server_name}</p>

           
              <a 
                style="text-decoration: none; color: black; margin-top: 1rem; background-color: #85EA2D; padding: .25rem .5rem; border-radius: .25rem; text-align:center;" 
                href="/api-docs" target="_blank"
                >Explore Swagger API Docs</a>
                
                <div class="header-meta">
                    <div class="meta-item">
                        <span class="meta-label">Server Information </span>
                        <span class="meta-value">${serverMeta.cpuName}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">speed</span>
                        <span class="meta-value">${serverMeta.speed}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Uptime</span>
                        <span class="meta-value">${serverMeta.uptime}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Last Update</span>
                        <span class="meta-value">${serverMeta.lastUpdate}</span>
                    </div>
                </div>
            </div>
        </header>

          <div class="tabs">
            <div class="tab-nav">
              <button class="tab-button">CPU Usage</button>
              <button class="tab-button">API History</button>
              <button class="tab-button">View Logs</button>
            </div>

            <div class="tab-content">
              ${cpuUsageHtml}
            </div>

            <div class="tab-content">
              ${responseTimesTableHtml}
            </div>

            <div class="tab-content">
              ${logTableHtml}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export default serverMonitorPage;
