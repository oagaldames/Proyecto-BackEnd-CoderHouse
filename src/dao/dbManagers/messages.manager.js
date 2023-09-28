import { messageModel } from "../models/messages.js";

class MessageManager {
  constructor() {}
  async getAllMessages() {
    const messages = await messageModel.find().lean();
    return messages;
  }

  async saveMessage(message) {
    const result = await messageModel.create(message);
    return result;
  }
}

export default MessageManager;
