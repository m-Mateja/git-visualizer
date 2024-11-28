import {POST} from '../route';
import { NextRequest} from 'next/server';
import { expect, test } from 'vitest';

const apiUrl:string = 'http://localhost:3000'

test('POST in /api/clone-repo should return 500 when there is an empty input', async () => {

    const req: NextRequest = new NextRequest(`${apiUrl}/api/cone-repo`, {
        method: 'POST',
        body: JSON.stringify({repoUrl:''}),
    })

    const res: Response = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(500)
    expect(data.error).toBe('No input detected')
})

test('POST in /api/clone-repo should return 500 when there is an invalid repo', async () => {

    const req: NextRequest = new NextRequest(`${apiUrl}/api/cone-repo`, {
        method: 'POST',
        body: JSON.stringify({repoUrl:'asdfasdfasdf'}),
    })

    const res: Response = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(500)
    expect(data.error).toBe('Git Repo does not exist or is private')
})

test('POST in /api/clone-repo should return 500 when there is a misspelled or inaccessible repo', async () => {

    const req: NextRequest = new NextRequest(`${apiUrl}/api/cone-repo`, {
        method: 'POST',
        body: JSON.stringify({repoUrl:'https://github.com/m-Mateja/Automated-Court-Bookererror'}),
    })

    const res: Response = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(500)
    expect(data.error).toBe('Git Repo does not exist or is private')
})

test('POST in /api/clone-repo should return 200 when a valid repo has been cloned', async () => {

    const req: NextRequest = new NextRequest(`${apiUrl}/api/cone-repo`, {
        method: 'POST',
        body: JSON.stringify({repoUrl:'https://github.com/m-Mateja/Automated-Court-Booker'}),
    })

    const res: Response = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.data).toBe('Git Repo cloned successfully')
})


