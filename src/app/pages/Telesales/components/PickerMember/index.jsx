import { FloatingPortal } from '@floating-ui/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, LayoutGroup, m } from 'framer-motion'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from 'src/app/_ezs/core/Auth'
import { Button } from 'src/app/_ezs/partials/button'
import { Input, InputNumber, InputTextarea } from 'src/app/_ezs/partials/forms'
import { SelectService, SelectStatusTelesale, SelectStocks } from 'src/app/_ezs/partials/select'
import { useMutation, useQueryClient } from 'react-query'
import MemberAPI from 'src/app/_ezs/api/member.api'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'

const SchemaAdd = yup
  .object({
    FullName: yup.string().required('Vui lòng nhập họ tên'),
    Phone: yup.string().required('Vui lòng nhập số điện thoại')
  })
  .required()

let initialValues = {
  ID: 0,
  FullName: '',
  Phone: '',
  MemberID: 0,
  Note: '',
  His: {
    //Lịch sử
  },
  Noti: {
    //Lịch nhắc
  },
  Book: {
    //Đặt lịch
  },
  CurrentStockID: 0,
  CurrentUserID: 0,
  Status: '',
  ServiceIds: ''
}

function PickerMember({ children, rowData }) {
  const { CrStocks, auth } = useAuth()
  const [visible, setVisible] = useState(false)
  const queryClient = useQueryClient()

  const { page_tele_basic, page_tele_adv } = useRoles(['page_tele_basic', 'page_tele_adv'])

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: rowData ? { ...rowData } : { ...initialValues, CurrentStockID: CrStocks?.ID || '' },
    resolver: yupResolver(SchemaAdd)
  })

  const searchMutation = useMutation({
    mutationFn: (data) => MemberAPI.search(data)
  })

  const createMutation = useMutation({
    mutationFn: (data) => MemberAPI.create(data)
  })

  const addMutation = useMutation({
    mutationFn: (data) => TelesalesAPI.addMember(data)
  })

  const checkPhone = (value) => {
    searchMutation.mutate(
      { Key: value },
      {
        onSuccess: ({ data }) => {
          if (data?.data && data?.data.length === 1 && data?.data.some((x) => x.suffix === value)) {
            reset({
              ID: 0,
              FullName: data?.data[0].text,
              Phone: data?.data[0].suffix,
              MemberID: data?.data[0].id,
              Note: '',
              His: {
                //Lịch sử
              },
              Noti: {
                //Lịch nhắc
              },
              Book: {
                //Đặt lịch
              },
              CurrentStockID: CrStocks?.ID || '',
              CurrentUserID: 0,
              Status: ''
            })
          } else {
            let newInitialValues = { ...initialValues, CurrentStockID: CrStocks?.ID || '' }
            Object.keys(newInitialValues).forEach((key) => {
              if (key !== 'Phone') {
                setValue(key, newInitialValues[key])
              }
            })
          }
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )
  }

  const onHide = () => {
    setVisible(false)
  }

  const onSubmit = async (values) => {
    let newValues = {
      edit: [
        {
          ...values,
          ServiceIds: values.ServiceIds ? values.ServiceIds.join(',') : '',
          CurrentUserID: auth?.ID
        }
      ]
    }
    if (!values.MemberID) {
      const dataCreate = {
        member: {
          MobilePhone: values.Phone,
          FullName: values.FullName,
          IsAff: 1
        }
      }
      let { data } = await createMutation.mutateAsync(dataCreate)
      if (data?.member?.ID) {
        newValues.edit[0].MemberID = data?.member?.ID
      }
    }

    addMutation.mutate(newValues, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['ListTelesales'] }).then(() => {
          onHide()
          reset({ ...initialValues, CurrentStockID: CrStocks?.ID || '' })
          window.top?.toastr &&
            window.top?.toastr.success(values?.ID ? 'Lưu thay đổi thành công' : 'Thêm mới thành công.', '', {
              timeOut: 1500
            })
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
                        <div className='text-2xl font-bold'>
                          {rowData?.ID ? 'Chỉnh sửa khách hàng' : 'Thêm mới khách hàng'}
                        </div>
                        <div
                          className='absolute flex items-center justify-center w-12 h-12 cursor-pointer right-2 top-2/4 -translate-y-2/4'
                          onClick={onHide}
                        >
                          <XMarkIcon className='w-8' />
                        </div>
                      </Dialog.Title>
                      <div className='p-5 overflow-auto grow'>
                        <div className='mb-3.5'>
                          <div className='font-light'>Số điện thoại</div>
                          <div className='mt-1'>
                            <Controller
                              name='Phone'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <>
                                  <InputNumber
                                    loading={searchMutation.isLoading}
                                    allowLeadingZeros={true}
                                    placeholder='Nhập số điện thoại'
                                    value={field.value}
                                    onValueChange={(val) => {
                                      field.onChange(val.value || '')
                                      checkPhone(val.value || '')
                                    }}
                                    errorMessageForce={fieldState?.invalid}
                                    errorMessage={fieldState?.error?.message}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
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
                                  StockRoles={
                                    page_tele_adv?.hasRight ? page_tele_adv?.StockRoles : page_tele_basic.StockRoles
                                  }
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className='mb-3.5'>
                          <div className='font-light'>Dịch vụ</div>
                          <div className='mt-1'>
                            <Controller
                              name='ServiceIds'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <SelectService
                                  isMulti
                                  isClearable
                                  className='select-control'
                                  value={field.value}
                                  onChange={(val) => field.onChange(val ? val.map((x) => x.value) : [])}
                                  MemberID={rowData?.MemberID}
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className='mb-3.5'>
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
                        <div>
                          <div className='font-light'>Trạng thái</div>
                          <div className='mt-1'>
                            <Controller
                              name='Status'
                              control={control}
                              render={({ field: { ref, ...field }, fieldState }) => (
                                <SelectStatusTelesale
                                  isClearable
                                  className='select-control'
                                  value={field.value}
                                  onChange={(val) => field.onChange(val?.value || '')}
                                />
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
                          disabled={addMutation.isLoading || createMutation.isLoading}
                          loading={addMutation.isLoading || createMutation.isLoading}
                          type='submit'
                          className='relative flex items-center h-12 px-5 ml-2 text-white transition rounded shadow-lg bg-primary hover:bg-primaryhv focus:outline-none focus:shadow-none disabled:opacity-70'
                        >
                          {rowData?.ID ? 'Lưu thay đổi' : 'Thêm mới'}
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

export default PickerMember
