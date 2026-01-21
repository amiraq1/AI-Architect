const OpenAI = require('openai');
const puppeteer = require('puppeteer');

// محاكاة البيئة
process.env.OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // يجب عليك استبدال هذا بالمفتاح الحقيقي عند التشغيل

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
    console.error("الرجاء وضع مفتاح OPENAI_API_KEY في ملف البيئة أو في الكود للاختبار.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function performWebSearch(query) {
    console.log(`[Tool] Searching web for: ${query}`);
    return JSON.stringify({
        results: [
            { title: "Test Result 1", snippet: "This is a test search result." }
        ]
    });
}

async function browseWebsite(url) {
    console.log(`[Tool] Browsing: ${url}`);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
        const screenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg' });
        await browser.close();
        return JSON.stringify({ success: true, text: text, screenshot: `data:image/jpeg;base64,${screenshot}` });
    } catch (e) {
        await browser.close();
        return JSON.stringify({ success: false, error: e.message });
    }
}

const tools = [
    {
        type: "function",
        function: {
            name: "visit_page",
            description: "Visit a URL",
            parameters: { type: "object", properties: { url: { type: "string" } }, required: ["url"] }
        }
    }
];

async function runTest() {
    console.log("Starting Agent Test...");

    // محاكاة رسالة المستخدم
    const userMessage = { role: "user", content: "اذهب إلى example.com وصف لي ما تراه." };
    const messages = [
        { role: "system", content: "You are a helpful agent." },
        userMessage
    ];

    console.log("Sending to OpenAI...");
    const runner = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        tools: tools,
        tool_choice: "auto"
    });

    const msg = runner.choices[0].message;
    console.log("First Response:", msg.tool_calls ? "Requesting Tool Calls" : msg.content);

    if (msg.tool_calls) {
        messages.push(msg);
        for (const tool of msg.tool_calls) {
            if (tool.function.name === "visit_page") {
                const args = JSON.parse(tool.function.arguments);
                const output = JSON.parse(await browseWebsite(args.url));

                messages.push({
                    tool_call_id: tool.id,
                    role: "tool",
                    name: "visit_page",
                    content: JSON.stringify({ text: output.text })
                });

                messages.push({
                    role: "user",
                    content: [
                        { type: "text", text: "Screenshot Analysis:" },
                        { type: "image_url", image_url: { url: output.screenshot } }
                    ]
                });
            }
        }

        console.log("Sending tool outputs back to OpenAI...");
        const final = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages
        });

        console.log("Final Agent Reply:", final.choices[0].message.content);
    }
}

runTest();
