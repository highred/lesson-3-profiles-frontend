import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

interface AvatarProps {
  url: string | null;
  size: number;
  onUpload: (filePath: string) => void;
  readonly?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ url, size, onUpload, readonly = false }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url && supabase) {
        downloadImage(url)
    }
  }, [url])

  async function downloadImage(path: string) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error)
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    if (!supabase) return;
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full object-cover"
          style={{ height: size, width: size }}
        />
      ) : (
        <div 
            className="bg-base-300 rounded-full flex items-center justify-center"
            style={{ height: size, width: size }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-1/2 w-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
      )}
      {!readonly && (
      <div className="mt-4">
        <label className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition cursor-pointer" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload Avatar'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
      )}
    </div>
  )
}

export default Avatar;