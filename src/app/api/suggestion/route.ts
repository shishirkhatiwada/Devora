import { generateText, Output } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

const suggestionSchema = z.object({
    suggestion: z
        .string()
        .describe(
            "The code to insert at cursor, or empty string if no completion needed"
        ),
});

const SUGGESTION_PROMPT = `You are a code suggestion assistant.

<context>
<file_name>{fileName}</file_name>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<instructions>
Follow these steps IN ORDER:

1. First, look at next_lines. If next_lines contains ANY code, check if it continues from where the cursor is. If it does, return empty string immediately - the code is already written.

2. Check if before_cursor ends with a complete statement (;, }, )). If yes, return empty string.

3. Only if steps 1 and 2 don't apply: suggest what should be typed at the cursor position, using context from full_code.

Your suggestion is inserted immediately after the cursor, so never suggest code that's already in the file.
</instructions>

You MUST respond with this EXACT JSON format and no other text:
{"suggestion": "<code or empty string>"}

The JSON key MUST be the full word "suggestion". Not "s", not "sugg", not anything else. The complete word "suggestion".`;

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const {
            fileName,
            code,
            currentLine,
            previousLines,
            textBeforeCursor,
            textAfterCursor,
            nextLines,
            lineNumber,
        } = await request.json();

        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        const prompt = SUGGESTION_PROMPT
            .replace("{fileName}", fileName)
            .replace("{code}", code)
            .replace("{currentLine}", currentLine)
            .replace("{previousLines}", previousLines || "")
            .replace("{textBeforeCursor}", textBeforeCursor)
            .replace("{textAfterCursor}", textAfterCursor)
            .replace("{nextLines}", nextLines || "")
            .replace("{lineNumber}", lineNumber.toString());

      const { output } = await generateText({
    model: groq("meta-llama/llama-4-scout-17b-16e-instruct"), 
    output: Output.object({ schema: suggestionSchema }),
    prompt,
    maxOutputTokens: 1024,
    temperature: 0.7,
});

        return NextResponse.json({ suggestion: output.suggestion });

    } catch (error: unknown) {
        if (
            error instanceof Error &&
            error.message.includes("json_validate_failed")
        ) {
            return NextResponse.json({ suggestion: "" });
        }

        console.error("Suggestion error: ", error);
        return NextResponse.json(
            { error: "Failed to generate suggestion" },
            { status: 500 }
        );
    }
}