import {
    defineConfig
} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
    base: command === 'serve' ? '' : '/Admin/PageTele/',
    plugins: [react()],
    resolve: {
        alias: {
            src: "/src",
        },
    },
    server: {
        port: 3000,
        host: true
    },
}))