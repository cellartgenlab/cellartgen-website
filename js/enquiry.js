(() => {
 const form=document.getElementById('cellartgenEnquiryForm');if(!form)return;
 const feedback=document.getElementById('enquiryFeedback');const submit=form.querySelector('button[type=submit],button:not([type])');
 form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const values=Object.fromEntries(new FormData(form).entries());submit.disabled=true;const old=submit.innerText;submit.innerText='Submitting…';feedback.textContent='';
  try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Submission failed.');feedback.textContent=data.message;feedback.style.color='#4b9b68';form.reset();}
  catch(error){feedback.textContent=error.message;feedback.style.color='#c66b5f';}
  finally{submit.disabled=false;submit.innerText=old;}
 });
})();
