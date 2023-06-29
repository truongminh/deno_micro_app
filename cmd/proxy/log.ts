
export function NewLogger(id: string) {
    const prefix = `[id=${id}]`;
    return {
        info: (...args: any[]) => console.log(prefix, ...args),
        error: (...args: any[]) => console.error(prefix, ...args),
    }
}

export const logger = NewLogger("main");

