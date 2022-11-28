import React from "react"

export default function RowGenerate({ id, debitedAccountId, creditedAccountId, value, createdAt }: cahsOutOrIn) {
  const valor = `IT$ ${value},00`;
  const date = new Date(createdAt);
  const formatedDate = date.toLocaleDateString();
  const formatedTime = date.toLocaleTimeString();
  
  return (
    <tr key={id}>
      <td>{id}</td>
      <td>{debitedAccountId}</td>
      <td>{creditedAccountId}</td>
      <td>{valor}</td>
      <td>{formatedDate}</td>
      <td>{formatedTime}</td>
    </tr>
  )
}