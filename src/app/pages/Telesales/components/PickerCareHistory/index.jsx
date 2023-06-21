import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { useEffect } from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import { Button } from 'src/app/_ezs/partials/button'
import { InputTextarea } from 'src/app/_ezs/partials/forms'
import ItemsCareHistory from './ItemsCareHistory'

function PickerCareHistory({ children, rowData }) {
  const [Items, setItems] = useState([])
  const [visible, setVisible] = useState(false)

  const queryClient = useQueryClient()

  useEffect(() => {
    setItems(rowData?.His?.List || [])
  }, [rowData])

  const { control, handleSubmit, reset } = useForm({
    defaultValues: { Content: '' }
  })

  const addMutation = useMutation({
    mutationFn: (data) => TelesalesAPI.addMember(data)
  })

  const onHide = () => setVisible(false)

  const onSubmit = ({ Content }) => {
    const item = {
      CreateDate: new Date(),
      Content: Content
    }
    let dataPost = {
      edit: [
        {
          ...rowData,
          His: {
            ...rowData?.His,
            List: rowData?.His?.List ? [item, ...rowData?.His?.List] : [item]
          }
        }
      ]
    }

    addMutation.mutate(dataPost, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ListTelesales'] }).then(() => {
          reset()
        })
      },
      onError: (error) => {
        console.log(error)
      }
    })
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
                <div className='fixed inset-0 flex items-center justify-center z-[1003]' autoComplete='off'>
                  <m.div
                    className='absolute top-0 right-0 flex flex-col justify-center h-full'
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Dialog.Panel tabIndex={0} className='bg-white max-w-full w-[450px] h-full flex flex-col shadow-lg'>
                      <Dialog.Title className='relative flex justify-between px-5 py-5 border-b border-light'>
                        <div>
                          <div className='text-2xl font-bold'>Lịch sử chăm sóc</div>
                          <div className='mt-px font-medium'>
                            {rowData?.FullName} - {rowData?.Phone}
                          </div>
                        </div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
                      <div className='p-5 border-b'>
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                          <div className='mb-3.5'>
                            <Controller
                              name='Content'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <InputTextarea rows={4} placeholder='Nhập nội dung' {...field} />
                              )}
                            />
                          </div>
                          <div>
                            <Button
                              loading={addMutation.isLoading}
                              disabled={addMutation.isLoading}
                              type='submit'
                              className='relative flex items-center h-12 px-5 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                            >
                              Thêm mới
                            </Button>
                          </div>
                        </form>
                      </div>
                      <div className='p-5 overflow-auto grow'>
                        {Items &&
                          Items.map((item, index) => (
                            <ItemsCareHistory {...{ item, rowData, Items, index }} key={index} />
                          ))}
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

export default PickerCareHistory
