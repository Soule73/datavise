export interface AIMessage {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    widgetsGenerated?: number;
}

export function createAIMessage(
    role: "user" | "assistant",
    content: string,
    widgetsGenerated?: number
): AIMessage {
    return {
        role,
        content,
        timestamp: new Date(),
        widgetsGenerated,
    };
}

export function validateAIMessage(message: AIMessage): boolean {
    return (
        (message.role === "user" || message.role === "assistant") &&
        !!message.content &&
        message.content.trim().length > 0 &&
        message.timestamp instanceof Date
    );
}
