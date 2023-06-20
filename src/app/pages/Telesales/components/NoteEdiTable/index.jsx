import { useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import Text from 'react-texty'
import TelesalesAPI from 'src/app/_ezs/api/telesales.api'
import { Input } from 'src/app/_ezs/partials/forms'

function NoteEdiTable({ initialValues }) {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const queryClient = useQueryClient()
  const inputRef = useRef()

  useEffect(() => {
    setValue(initialValues?.Note || '')
  }, [initialValues])

  useEffect(() => {
    if (isOpen) {
      inputRef?.current?.focus()
    }
  }, [isOpen])

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen
  })

  const click = useClick(context)

  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      setIsOpen(false)
      return onSubmit(value)
    }
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const addMutation = useMutation({
    mutationFn: (data) => TelesalesAPI.addMember(data)
  })

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onSubmit = (val) => {
    if (val === initialValues?.Note) return

    let dataPost = {
      edit: [
        {
          ...initialValues,
          Note: val || ''
        }
      ]
    }

    addMutation.mutate(dataPost, {
      onSuccess: () => {
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
        <Text tooltipMaxWidth={280} className='w-full truncate'>
          {value || <span className='text-muted'>Nhập ghi chú</span>}
        </Text>
      </div>
      {isOpen && (
        <div
          className='absolute top-0 left-0 w-full h-full bg-white px-[15px] py-[12px] flex flex-col items-center justify-center'
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          <Input
            disabled={addMutation.isLoading}
            loading={addMutation.isLoading}
            ref={inputRef}
            value={value}
            wrapClass='w-full'
            placeholder='Nhập ghi chú'
            onChange={onChange}
            onBlur={(e) => onSubmit(e.target.value)}
          />
        </div>
      )}
    </>
  )
}

export default NoteEdiTable
