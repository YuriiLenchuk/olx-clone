/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler:{
        styledComponents:true
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home', // або /home, якщо шлях без (main)
                permanent: true,
            },
        ]
    }
};

export default nextConfig;
