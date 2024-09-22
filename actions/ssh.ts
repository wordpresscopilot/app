import WebSocket from 'ws';

interface ConnectionData {
  action: 'connect';
  hostname: string;
  port: number;
  username: string;
  password: string;
}

interface CommandData {
  action: 'command';
  command: string;
}

interface ScriptData {
  action: 'script';
  content: string;
}

interface DisconnectData {
  action: 'disconnect';
}

type WebSocketData = ConnectionData | CommandData | ScriptData | DisconnectData;

interface ResponseData {
  action: 'connected' | 'output' | 'error';
  output?: string;
  message?: string;
}

export class SSHProxyClient {
  private ws: WebSocket | null = null;
  private uri: string = "wss://ssh-proxy-jhv4.onrender.com";

  async connect(hostname: string, port: number, username: string, password: string, wp_root_dir_path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.uri);

      this.ws.on('open', () => {
        const connectionData: ConnectionData = {
          action: 'connect',
          hostname,
          port,
          username,
          password
        };
        this.ws!.send(JSON.stringify(connectionData));
      });

      this.ws.on('message', async (data: string) => {
        const response: ResponseData = JSON.parse(data);
        if (response.action === 'connected') {
          console.log("Connected to SSH server");
          // Change directory to wp_root_dir_path immediately after connecting
          try {
            const response = await this.executeCommand(`cd ${wp_root_dir_path}`);
            console.log("Change directory response:", response);
            // Run ls command after changing directory
            const lsResponse = await this.executeCommand('ls -la');
            console.log("Directory contents:", lsResponse);
            resolve();
          } catch (error: any) {
            reject(new Error(`Failed to change directory: ${error.message}`));
          }
        } else if (response.action === 'error') {
          reject(new Error(response.message));
        }
      });

      this.ws.on('error', (error) => {
        reject(error);
      });
    });
  }

  async executeCommand(command: string): Promise<string> {
    if (!this.ws) {
      throw new Error("Not connected to SSH server");
    }

    return new Promise((resolve, reject) => {
      const commandData: CommandData = {
        action: 'command',
        command
      };
      this.ws!.send(JSON.stringify(commandData));

      let output = '';
      const messageHandler = (data: string) => {
        const response: ResponseData = JSON.parse(data);
        if (response.action === 'output') {
          output += response.output || '';
        } else if (response.action === 'error') {
          this.ws!.removeListener('message', messageHandler);
          reject(new Error(response.message));
        }
      };

      this.ws!.on('message', messageHandler);

      // Set a timeout to resolve the promise after a certain period
      setTimeout(() => {
        this.ws!.removeListener('message', messageHandler);
        resolve(output);
      }, 5000); // 5 second timeout
    });
  }

  async executeScript(scriptContent: string): Promise<string> {
    if (!this.ws) {
      throw new Error("Not connected to SSH server");
    }

    return new Promise((resolve, reject) => {
      const scriptData: ScriptData = {
        action: 'script',
        content: scriptContent
      };
      this.ws!.send(JSON.stringify(scriptData));

      let output = '';
      const messageHandler = (data: string) => {
        const response: ResponseData = JSON.parse(data);
        if (response.action === 'output') {
          output += response.output || '';
        } else if (response.action === 'error') {
          this.ws!.removeListener('message', messageHandler);
          reject(new Error(response.message));
        }
      };

      this.ws!.on('message', messageHandler);

      // Set a timeout to resolve the promise after a certain period
      setTimeout(() => {
        this.ws!.removeListener('message', messageHandler);
        resolve(output);
      }, 10000); // 10 second timeout for script execution
    });
  }

  disconnect(): void {
    if (this.ws) {
      const disconnectData: DisconnectData = { action: 'disconnect' };
      this.ws.send(JSON.stringify(disconnectData));
      this.ws.close();
      this.ws = null;
    }
  }
}
