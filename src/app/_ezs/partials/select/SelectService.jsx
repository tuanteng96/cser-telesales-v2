import { useQuery } from 'react-query'
import Select from 'react-select'
import ProdsAPI from '../../api/prods.api'

function SelectService({ isMulti, value, loading, disabled, MemberID = '', StockID = '', ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ListStaffs', { MemberID, StockID }],
    queryFn: async () => {
      const { data } = await ProdsAPI.getRootServices({
        Key: '',
        StockID: StockID,
        MemberID: MemberID?.value || ''
      })
      return data?.lst?.map((x) => ({ ...x, label: x.Title, value: x.ID })) || []
    }
  })

  return (
    <>
      <Select
        isMulti={isMulti}
        isLoading={loading || isLoading}
        isDisabled={disabled || isLoading}
        menuPosition='fixed'
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        classNamePrefix='select'
        options={data || []}
        value={
          isMulti
            ? data?.filter((x) => value && value.some((k) => k === x.value))
            : data?.filter((x) => x.value === value)
        }
        placeholder='Chọn dịch vụ'
        noOptionsMessage={() => 'Không có dịch vụ'}
        {...props}
      />
    </>
  )
}

export { SelectService }
