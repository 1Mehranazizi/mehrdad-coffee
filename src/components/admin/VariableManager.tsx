"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";

type Option={id:string;slug:string;title:string};
export default function VariableManager({initial}:{initial:Option[]}) {
 const [items,setItems]=useState(initial); const [editing,setEditing]=useState<string|null>(null); const [title,setTitle]=useState(""); const [slug,setSlug]=useState(""); const [saving,setSaving]=useState(false);
 const start=(x?:Option)=>{setEditing(x?.id??"new");setTitle(x?.title??"");setSlug(x?.slug??"");};
 const save=async()=>{setSaving(true);const method=editing==="new"?"POST":"PATCH";const url=editing==="new"?"/api/admin/grinds":`/api/admin/grinds/${editing}`;const res=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify({title,slug})});const data=await res.json();if(res.ok){if(editing==="new")setItems(v=>[...v,data.option]);else setItems(v=>v.map(x=>x.id===editing?{...x,title,slug}:x));setEditing(null);}else alert(data.error||"خطا");setSaving(false)};
 const remove=async(id:string)=>{if(!confirm("این گزینه حذف شود؟"))return;const res=await fetch(`/api/admin/grinds/${id}`,{method:"DELETE"});if(res.ok)setItems(v=>v.filter(x=>x.id!==id));};
 return <div className="max-w-2xl rounded-3xl border border-line bg-cream p-5 sm:p-6"><div className="flex items-center justify-between mb-5"><h2 className="font-bold">انواع آسیاب</h2>{editing===null&&<button onClick={()=>start()} className="inline-flex items-center gap-1.5 rounded-full bg-ink text-cream px-4 py-2 text-xs font-semibold"><Plus size={15}/> افزودن</button>}</div><div className="space-y-2">{items.map(x=>editing===x.id?<Editor key={x.id}/>:<div key={x.id} className="flex items-center justify-between rounded-2xl border border-line bg-paper p-3"><div><p className="font-semibold text-sm">{x.title}</p><p className="text-xs text-ink-soft" dir="ltr">{x.slug}</p></div><div className="flex gap-1"><button onClick={()=>start(x)} className="p-2 rounded-full hover:bg-paper-deep"><Pencil size={16}/></button><button onClick={()=>remove(x.id)} className="p-2 rounded-full hover:bg-red-50 text-red-700"><Trash2 size={16}/></button></div></div>)}{editing==="new"&&<Editor/>}</div>
 {items.length===0&&editing===null&&<p className="text-sm text-ink-soft text-center py-8">هنوز متغیری ثبت نشده است.</p>}
 </div>;
 function Editor(){return <div className="rounded-2xl border border-coffee bg-paper p-3 grid sm:grid-cols-[1fr_1fr_auto] gap-2"><input autoFocus placeholder="عنوان، مثلاً آسیاب اسپرسو" value={title} onChange={e=>setTitle(e.target.value)} className="rounded-xl border border-line bg-cream px-3 py-2 text-sm"/><input placeholder="slug" dir="ltr" value={slug} onChange={e=>setSlug(e.target.value)} className="rounded-xl border border-line bg-cream px-3 py-2 text-sm"/><div className="flex gap-1"><button disabled={saving} onClick={save} className="p-2 rounded-full bg-ink text-cream"><Check size={16}/></button><button onClick={()=>setEditing(null)} className="p-2 rounded-full border border-line"><X size={16}/></button></div></div>}
}
