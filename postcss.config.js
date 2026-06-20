import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';


export default{
  plugins: [
    tailwindcss,
    tailwindcss('./tailwind.config.js'),
    autoprefixer
  ],
}