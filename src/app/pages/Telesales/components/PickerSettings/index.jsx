import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, m } from 'framer-motion'
import { useState } from 'react'
import { useQuery } from 'react-query'
import ConfigAPI from 'src/app/_ezs/api/config.api'
import StatusForm from './StatusForm'
import ProgressForm from './ProgressForm'
import { parseProgressValue } from './progressValues.js'

function PickerSettings({ children }) {
  const [{ visible, title, name }, setPicker] = useState({ visible: false, title: '', name: '' })
  const onClose = () => setPicker((previous) => ({ ...previous, visible: false }))

  const settingsQuery = useQuery({
    queryKey: ['TelesalesSettings', name],
    queryFn: async () => {
      const result = await ConfigAPI.getName(name)
      console.log(`[${name}] result`, result)
      if (result.data?.error) throw new Error(result.data.error)
      if (!Array.isArray(result.data?.data)) throw new Error('Dữ liệu cấu hình không hợp lệ.')
      if (name === 'ttpage') parseProgressValue(result.data.data[0]?.Value || '')
      return result
    },
    enabled: visible && Boolean(name)
  })

  return (
    <>
      {children({
        open: ({ title, name }) => setPicker({ visible: true, title, name }),
        close: onClose
      })}
      <AnimatePresence>
        {visible && (
          <FloatingPortal>
            <Dialog open={visible} onClose={onClose}>
              <m.div
                className='fixed inset-0 bg-black/[.2] z-[1003]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <div className='fixed inset-0 flex items-center justify-center z-[1003]'>
                <m.div
                  className={`absolute flex flex-col justify-center h-full py-8 w-full px-5 md:px-0 ${name === 'ttpage' ? 'max-w-[640px]' : 'max-w-[500px]'}`}
                  initial={{ opacity: 0, top: '60%' }}
                  animate={{ opacity: 1, top: 'auto' }}
                  exit={{ opacity: 0, top: '60%' }}
                >
                  <Dialog.Panel className='flex flex-col w-full max-h-full bg-white rounded shadow-lg'>
                    <div className='relative flex items-center px-5 py-5 border-b border-light shrink-0'>
                      <Dialog.Title className='pr-10 text-xl font-bold md:text-2xl'>{title}</Dialog.Title>
                      <button
                        type='button'
                        aria-label='Đóng'
                        onClick={onClose}
                        className='absolute flex items-center justify-center w-12 h-12 right-2 top-2/4 -translate-y-2/4'
                      >
                        <XMarkIcon className='w-8' aria-hidden='true' />
                      </button>
                    </div>
                    {name === 'kqtele' && settingsQuery.isSuccess ? (
                      <StatusForm value={settingsQuery.data?.data?.data?.[0]?.Value || ''} onClose={onClose} />
                    ) : name === 'ttpage' && settingsQuery.isSuccess ? (
                      <ProgressForm value={settingsQuery.data?.data?.data?.[0]?.Value || ''} onClose={onClose} />
                    ) : (
                      <>
                        <div className='min-h-[160px] p-5 overflow-auto grow'>
                          {settingsQuery.isLoading && <div role='status'>Đang tải...</div>}
                          {settingsQuery.isError && <div role='alert' className='text-danger'>Không thể tải cấu hình. Vui lòng đóng và mở lại để thử lại.</div>}
                        </div>
                        <div className='flex justify-end p-5 border-t border-light'>
                          <button
                            type='button'
                            onClick={onClose}
                            className='relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800'
                          >
                            Đóng
                          </button>
                        </div>
                      </>
                    )}
                  </Dialog.Panel>
                </m.div>
              </div>
            </Dialog>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export default PickerSettings
