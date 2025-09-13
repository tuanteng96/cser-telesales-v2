import React from 'react'
import Select from 'react-select'
import ConfigAPI from '../../api/config.api'
import { useQuery } from 'react-query'

function SelectSourceTelesale({ value, isMulti, loading, disabled, ...props }) {
  const { data, isLoading } = useQuery({
    queryKey: ['StatusTelesale'],
    queryFn: async () => {
      const { data } = await ConfigAPI.getName('MemberSourceConfig')
      let rs = []
      if (data && data.data) {
        let values = JSON.parse(data.data[0].Value)
        if (values.sources && values.sources.length > 0) {
          rs = values.sources.map((x) => ({
            label: x.text,
            value: x.text
          }))
        }
      }
      return rs
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
        value={value && data && data?.filter((x) => x.value === value)}
        placeholder='Chọn nguồn'
        noOptionsMessage={() => 'Không có dữ liệu'}
        {...props}
      />
    </>
  )
}

export { SelectSourceTelesale }
