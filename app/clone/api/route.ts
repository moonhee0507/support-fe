import path from "path";
import fs from "fs";
import { exec } from "child_process";

export async function POST(req: Request) {
    const body = await req.json();
    const { applicantNumbers, cloneUrls } = body;

    if (!applicantNumbers || !cloneUrls) {
        return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
    }

    // 다운로드되는 폴더 경로
    const tmpPath = path.join(process.env.HOME || "", "tmp");
    // tmp 디렉토리 생성
    if (!fs.existsSync(tmpPath)) {
        fs.mkdirSync(tmpPath);
    }
    
    const levelTestPath = path.join(tmpPath, "level-test");
    // level-test 폴더 생성
    if (!fs.existsSync(levelTestPath)) {
        fs.mkdirSync(levelTestPath);
    }

    // 날짜 기반 폴더 생성
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0"); // 로컬 시간의 시
    const minutes = String(now.getMinutes()).padStart(2, "0"); // 로컬 시간의 분
    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}`;
    const timestampFolderPath = path.join(levelTestPath, timestamp);
    fs.mkdirSync(timestampFolderPath);

    // 각 applicantNumber에 대해 폴더 생성 및 클론
    applicantNumbers.forEach((applicantNumber: number, index: number) => {
        if (!applicantNumber || !cloneUrls[index]) return;

        const applicantFolderPath = path.join(timestampFolderPath, String(applicantNumber));
        if (!fs.existsSync(applicantFolderPath)) {
            fs.mkdirSync(applicantFolderPath);
        }

        const cloneUrl = cloneUrls[index];
        exec(`git clone ${cloneUrl} ${applicantFolderPath}`, (error) => {
            if (error) {
                console.error(`Error cloning repository for ${applicantNumber}:`, error);
                // 해당 디렉토리 삭제
                fs.rmdirSync(applicantFolderPath, { recursive: true });
            }
            console.log(`Repository for ${applicantNumber} cloned successfully.`);
        });
    });

    return new Response(JSON.stringify({ message: "Clone operation started" }), { status: 200 });
}