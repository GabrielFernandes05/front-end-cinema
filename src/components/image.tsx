import Image from 'next/image'

type ImgProps = {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
}

export default function Img({ src, alt = 'Imagem', width = 500, height = 300, className = '' }: ImgProps) {
  return (
    <Image src={src} alt={alt} width={width} height={height} className={className} />
  )
}
