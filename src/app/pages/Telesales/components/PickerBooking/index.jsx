import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { Input, InputTextarea } from 'src/app/_ezs/partials/forms'
import { SelectStocks } from 'src/app/_ezs/partials/select'

function PickerBooking({ children, rowData }) {
  const { CrStocks } = useAuth()
  const [visible, setVisible] = useState(false)
  const queryClient = useQueryClient()

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {}
  })

  const onSubmit = (values) => {
    console.log(values)
  }

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
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className='fixed inset-0 flex items-center justify-center z-[1003]'
                  autoComplete='off'
                >
                  <m.div
                    className='absolute flex flex-col justify-center h-full py-8'
                    initial={{ opacity: 0, top: '60%' }}
                    animate={{ opacity: 1, top: 'auto' }}
                    exit={{ opacity: 0, top: '60%' }}
                  >
                    <Dialog.Panel
                      tabIndex={0}
                      className='bg-white max-w-full w-[500px] max-h-full flex flex-col rounded shadow-lg'
                    >
                      <Dialog.Title className='relative flex justify-between px-5 py-5 border-b border-light'>
                        <div className='text-2xl font-bold'>Đặt lịch</div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
                      <div className='p-5 overflow-auto grow'>
                        <div className='mb-3.5'>
                          <div className='font-light'>Họ và tên</div>
                          <div className='mt-1'>
                            <Controller
                              name='FullName'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <Input
                                  placeholder='Nhập họ tên'
                                  value={field.value}
                                  onChange={field.onChange}
                                  errorMessageForce={fieldState?.invalid}
                                  errorMessage={fieldState?.error?.message}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className='mb-3.5'>
                          <div className='font-light'>Cơ sở chuyển</div>
                          <div className='mt-1'>
                            <Controller
                              name='CurrentStockID'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <SelectStocks
                                  className='select-control'
                                  value={field.value}
                                  onChange={(val) => field.onChange(val?.value || '')}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <div className='font-light'>Ghi chú</div>
                          <div className='mt-1'>
                            <Controller
                              name='Note'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <InputTextarea rows={3} placeholder='Nhập ghi chú' {...field} />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-end p-5 border-t border-light'>
                        <button
                          type='button'
                          className='relative flex items-center h-12 px-5 transition border rounded shadow-lg border-light hover:border-gray-800 focus:outline-none focus:shadow-none'
                          onClick={onHide}
                        >
                          Hủy
                        </button>
                        <Button
                        //   disabled={addMutation.isLoading}
                        //   loading={addMutation.isLoading}
                          type='submit'
                          className='relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                        >
                          Thực hiện
                        </Button>
                      </div>
                    </Dialog.Panel>
                  </m.div>
                </form>
              </Dialog>
            </LayoutGroup>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  )
}

export default PickerBooking
