'use client';

import { useRouter } from "next/navigation";

let state = ["how to play minecraft", "how to play overwatch"];

export default async function Page() {

    async function onSubmitAction() {
        state.push('how to play finals');
        router.refresh();
    }
    const router = useRouter();

    return <main>
        <form action={onSubmitAction}>
            <input type="submit"/>
        </form>
        <Messages>

        </Messages>
    </main>
}

export async function Messages() {
    let b = []
    for (let i in state) {
        console.log(state[i]);
        b.push(
            <div>
                <a>{state[i]}</a>
            </div>
        )
    }
    return b;
}