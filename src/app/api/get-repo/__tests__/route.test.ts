import {GET} from '../route';
import { expect, test } from 'vitest';
import path from "path";
import {promises as fs} from "fs";

test('GET in /api/get-repo should return 500 when there is an error reading the repo files/folders', async () => {
    const reposDir: string = path.join(process.cwd(), '..', 'repo');
    try{
        await fs.rm(reposDir, {recursive: true, force: true})
    }
    catch{
        {}
    }


    const res: Response = await GET()
    const data = await res.json()
    expect(res.status).toBe(500)
    expect(data.error).toBe('Error reading files')
})

test('GET in /api/get-repo should return 200 when there is a folder present', async () => {
    const reposDir: string = path.join(process.cwd(), '..', 'repo');
    try{
        await fs.mkdir(reposDir)
    }
    catch{
        {}
    }

    const res: Response = await GET()
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.data).toBeTypeOf('object')
})