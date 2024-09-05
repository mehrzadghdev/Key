export const environment: Environment = {
    apiUrl: "https://api.keyacc.ir/",
    isDevMode: true,
}

interface Environment {
    readonly apiUrl: string;
    readonly isDevMode: boolean;
}