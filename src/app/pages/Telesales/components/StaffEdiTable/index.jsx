import { useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import { SelectStaffs } from 'src/app/_ezs/partials/select'
import Text from 'react-texty'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'

function StaffEdiTable({ initialValues }) {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const { page_tele_basic, page_tele_adv } = useRoles(['page_tele_basic', 'page_tele_adv'])

  const queryClient = useQueryClient()

  useEffect(() => {
    setValue(initialValues?.CurrentUserID || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen
  })

  const click = useClick(context)

  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const addMutation = useMutation({
    mutationFn: (data) => TelesalesAPI.addMember(data)
  })

  const onChange = (val) => {
    setValue(val?.value || '')

    let dataPost = {
      edit: [
        {
          ...initialValues,
          CurrentUserID: val?.value || ''
        }
      ]
    }

    addMutation.mutate(dataPost, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['ListTelesales'] })
      },
      onError: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <>
      <div className='flex items-center w-full cursor-pointer' ref={refs.setReference} {...getReferenceProps()}>
        <Text tooltipMaxWidth={280} className='flex-1 truncate'>
          {initialValues?.CurrentUser ? initialValues?.CurrentUser?.FullName : 'Chọn nhân viên'}
        </Text>
        <ChevronDownIcon className='w-4 ml-1.5' />
      </div>
      {isOpen && (
        <div
          className='absolute top-0 left-0 w-full h-full bg-white px-[15px] py-[12px] flex flex-col items-center justify-center'
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          <SelectStaffs
            loading={addMutation.isLoading}
            disabled={!page_tele_adv.hasRight || addMutation.isLoading}
            isClearable
            className='w-full select-control'
            value={value}
            onChange={onChange}
            StockRoles={page_tele_adv?.hasRight ? page_tele_adv?.StockRolesAll : page_tele_basic.StockRolesAll}
          />
        </div>
      )}
    </>
  )
}

export default StaffEdiTable
