/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "localhost"],
    // Allow base64/data URIs displayed via regular <img> tags
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
  // Increase body size limit to 4MB for base64 image uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

module.exports = nextConfig;
