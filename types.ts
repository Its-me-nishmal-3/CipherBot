
export enum SenderType {
  User = 'user',
  Bot = 'bot',
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: SenderType;
  isStreaming?: boolean;
}
