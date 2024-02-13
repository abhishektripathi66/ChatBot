import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(request: NextRequest){
    //Check if the request has a valid JSON body
    const contentType = request.headers.get('content-type');
    if(!contentType || !contentType.includes('application/json')){
        return new NextResponse('Invalid content type',{status:400});
    }

    try{
        //Parse the JSON body to extract the 'query' property
        const requestBody = await request.json();
        const {query} = requestBody;
        
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: query }],
            model: "gpt-3.5-turbo",
        });

       return NextResponse.json({
            response: chatCompletion.choices[0].message.content
        });

    }
    catch(error){
        return new NextResponse('Invalid JSON data',{status :400});
    }
}