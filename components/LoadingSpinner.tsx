import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  fullScreen = false,
  message = 'Loading...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  }

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-stone-900 dark:border-stone-100 ${sizeClasses[size]}`}></div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-lg text-center max-w-sm mx-4">
          {spinner}
          {message && (
            <p className="text-stone-900 dark:text-stone-50 font-medium mt-4">{message}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
      {message && (
        <p className="text-stone-500 dark:text-stone-400 ml-3">{message}</p>
      )}
    </div>
  )
}
