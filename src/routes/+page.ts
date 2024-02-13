import { dev } from "$app/environment"

export const ssr = !dev //for the devlopment i need it to be false but when i run it for production it should use ssr how do i do it 