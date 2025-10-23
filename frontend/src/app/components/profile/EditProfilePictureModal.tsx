'use client';

import { useState } from 'react';
import CloseButton from './CloseButton';
import SaveButton from './SaveButton';
import Image from 'next/image';

type EditProfilePictureModalProps = {
  currentImage?: string;
  onClose: () => void;
  onSave: (newImage: string | null) => Promise<void>;
  onDelete?: () => Promise<void>;
  mockUpload: boolean;
};

const EditProfilePictureModal = ({
  currentImage,
  onClose,
  onSave,
  onDelete,
  mockUpload,
}: EditProfilePictureModalProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      let uploadedUrl: string | null = null;

      if (selectedImage) {
        if (mockUpload) {
          uploadedUrl = preview!;
        } else {
          const formData = new FormData();
          formData.append('file', selectedImage);

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          uploadedUrl = data.url;
        }
      } else if (preview === null) {
        await onDelete?.();
        uploadedUrl = null;
      } else {
        uploadedUrl = preview ?? currentImage ?? null;
      }

      await onSave(uploadedUrl);

      onClose();
    } catch (err) {
      console.error('Error saving profile picture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setPreview(null);
      setSelectedImage(null);
    }
  };
  return (
    <div
      className="fixed w-full inset-0 bg-black  flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="relative flex  ">
          <CloseButton onClick={onClose} />
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Profile Picture
          </h3>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 ">
            <Image
              src={
                preview && preview.trim() !== ''
                  ? preview
                  : 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
              }
              alt="Profile preview"
              fill
              sizes="200px"
              className="rounded-full border border-gray-200 object-cover mb-3"
            />
          </div>

          <label className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Upload new image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {preview && (
            <button
              onClick={handleDelete}
              className="mt-2 text-red-500 hover:text-red-700 text-sm"
              disabled={loading}
            >
              Delete current image
            </button>
          )}
        </div>

        <SaveButton
          onClick={handleSave}
          disabled={loading}
          loading={loading}
          text="Save changes"
          loadingText="Saving..."
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default EditProfilePictureModal;
