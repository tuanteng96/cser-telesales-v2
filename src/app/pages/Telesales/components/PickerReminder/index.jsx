import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { useState } from 'react'

function PickerReminder({ children }) {
  const [visible, setVisible] = useState(false)

  const onHide = () => setVisible(false)

  return (
    <>
      {children({
        open: () => setVisible(true),
        close: () => setVisible(false)
      })}
      <AnimatePresence>
        {visible && (
          <FloatingPortal>
            <LayoutGroup>
              <Dialog open={visible} onClose={onHide}>
                <m.div
                  className='fixed inset-0 bg-black/[.2] z-[1003]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></m.div>
                <div className='fixed inset-0 flex items-center justify-center z-[1003]' autoComplete='off'>
                  <m.div
                    className='absolute flex flex-col justify-center h-full top-0 right-0'
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Dialog.Panel tabIndex={0} className='bg-white max-w-full w-[450px] h-full flex flex-col shadow-lg'>
                      <Dialog.Title className='relative flex justify-between px-5 py-5 border-b border-light'>
                        <div className='text-2xl font-bold'>Lịch nhắc</div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
                      <div className='overflow-auto grow'>
                        <div className='p-5'>a</div>
                      </div>
                    </Dialog.Panel>
                  </m.div>
                </div>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export default PickerReminder
