const SNS = {
  SCHOOL_NAME: 'Sadhana Nivriti School',
  SCHOOL_LOCATION: 'Chotpur, Noida',
  SESSION: '2025-26',
  _seq: 0,
  uid(prefix) { return prefix + Date.now().toString(36) + (this._seq++).toString(36) + Math.random().toString(36).slice(2,6); },
  get(k) { try { return JSON.parse(localStorage.getItem('sns_'+k))||null; } catch { return null; } },
  set(k,v) { localStorage.setItem('sns_'+k, JSON.stringify(v)); },
  gd(k,d) { const v=this.get(k); return v!==null?v:d; },
  getPasscodes() { return this.gd('passcodes',{admin:'roshanbhagat92',teacher:'teacher@123',parent:'parent@123'}); },
  checkPasscode(panel,code) { return this.getPasscodes()[panel]===code; },
  updatePasscode(panel,code) { const c=this.getPasscodes(); c[panel]=code; this.set('passcodes',c); },
  setSession(panel) { sessionStorage.setItem('sns_panel',panel); },
  getPanel() { return sessionStorage.getItem('sns_panel'); },
  logout() { sessionStorage.clear(); window.location.href='index.html'; },
  requireLogin(p) { const panel=this.getPanel(); if(!panel){window.location.href='index.html';return false;} if(p&&panel!==p&&panel!=='admin'){window.location.href='index.html';return false;} return true; },
  getClasses() { return this.gd('classes',[
    {id:'c1a',name:'Class 1',section:'A',classTeacherId:'',strength:0},
    {id:'c1b',name:'Class 1',section:'B',classTeacherId:'',strength:0},
    {id:'c2a',name:'Class 2',section:'A',classTeacherId:'',strength:0},
    {id:'c3a',name:'Class 3',section:'A',classTeacherId:'',strength:0},
    {id:'c4a',name:'Class 4',section:'A',classTeacherId:'',strength:0},
    {id:'c5a',name:'Class 5',section:'A',classTeacherId:'',strength:0},
    {id:'c6a',name:'Class 6',section:'A',classTeacherId:'',strength:0},
    {id:'c7a',name:'Class 7',section:'A',classTeacherId:'',strength:0},
    {id:'c8a',name:'Class 8',section:'A',classTeacherId:'',strength:0},
    {id:'c9a',name:'Class 9',section:'A',classTeacherId:'',strength:0},
    {id:'c10a',name:'Class 10',section:'A',classTeacherId:'',strength:0},
  ]); },
  saveClasses(c) { this.set('classes',c); },
  getClassLabel(id) { const c=this.getClasses().find(x=>x.id===id); return c?`${c.name}-${c.section}`:id; },
  getSubjects(classId) { const all=this.gd('subjects',{}); return all[classId]||['English','Hindi','Mathematics','Science','Social Science']; },
  saveSubjectMap(m) { this.set('subjects',m); },
  getTeachers() { return this.gd('teachers',[]); },
  saveTeachers(t) { this.set('teachers',t); },
  addTeacher(t) { const a=this.getTeachers(); t.id=this.uid('T'); t.createdAt=new Date().toISOString(); a.push(t); this.saveTeachers(a); return t; },
  getTeacherName(id) { const t=this.getTeachers().find(x=>x.id===id); return t?t.name:'—'; },
  getStudents() { return this.gd('students',[]); },
  saveStudents(s) { this.set('students',s); },
  addStudent(s) {
    const all=this.getStudents();
    const inClass=all.filter(x=>x.classId===s.classId&&x.status==='active');
    s.id=this.uid('S'); s.rollNo=String(inClass.length+1).padStart(3,'0');
    s.admissionNo='SNS/'+new Date().getFullYear()+'/'+String(all.length+1).padStart(4,'0');
    s.status='active'; s.session=this.SESSION; s.createdAt=new Date().toISOString();
    all.push(s); this.saveStudents(all);
    const cls=this.getClasses(); const c=cls.find(x=>x.id===s.classId);
    if(c){c.strength=all.filter(x=>x.classId===s.classId&&x.status==='active').length; this.saveClasses(cls);}
    return s;
  },
  getStudentsByClass(cid) { return this.getStudents().filter(s=>s.classId===cid&&s.status==='active'); },
  todayKey() { return new Date().toISOString().split('T')[0]; },
  getAttendance(date) { return this.gd('att_'+date,{}); },
  saveAttendance(date,d) { this.set('att_'+date,d); },
  markAttendance(date,classId,records) { const a=this.getAttendance(date); a[classId]={records,markedAt:new Date().toISOString()}; this.saveAttendance(date,a); },
  getTodaySummary() {
    const att=this.getAttendance(this.todayKey()), cls=this.getClasses(), stu=this.getStudents().filter(s=>s.status==='active');
    let tp=0,ta=0,ts=0,mc=0;
    const cw=cls.map(c=>{
      const cs=stu.filter(s=>s.classId===c.id); const str=cs.length; ts+=str;
      if(att[c.id]){mc++; const rec=att[c.id].records||{}; const p=Object.values(rec).filter(v=>v==='P').length; tp+=p; ta+=(str-p); return {...c,strength:str,present:p,absent:str-p,marked:true,pct:str>0?Math.round(p/str*100):0};}
      return {...c,strength:str,present:0,absent:0,marked:false,pct:0};
    });
    return {classWise:cw,totalPresent:tp,totalAbsent:ta,totalStrength:ts,markedClasses:mc,unmarkedClasses:cls.length-mc};
  },
  getFeeStructures() { return this.gd('fee_structs',[]); },
  saveFeeStructures(f) { this.set('fee_structs',f); },
  getFeeRecords() { return this.gd('fee_recs',[]); },
  saveFeeRecords(f) { this.set('fee_recs',f); },
  addFeeRecord(r) {
    const all=this.getFeeRecords(); r.id=this.uid('F');
    r.receiptNo='SNS/RCP/'+new Date().getFullYear()+'/'+String(all.length+1).padStart(5,'0');
    r.createdAt=new Date().toISOString(); all.push(r); this.saveFeeRecords(all); return r;
  },
  getFeeSummary() {
    const recs=this.getFeeRecords(), today=this.todayKey();
    const todayAmt=recs.filter(r=>r.date===today).reduce((s,r)=>s+Number(r.amount),0);
    const total=recs.reduce((s,r)=>s+Number(r.amount),0);
    return {todayAmt,total,count:recs.length};
  },
  getEnquiries() { return this.gd('enquiries',[]); },
  addEnquiry(e) { const all=this.getEnquiries(); e.id=this.uid('E'); e.status='pending'; e.createdAt=new Date().toISOString(); all.push(e); this.set('enquiries',all); return e; },
  getExams() { return this.gd('exams',[]); },
  addExam(e) { const all=this.getExams(); e.id=this.uid('EX'); e.createdAt=new Date().toISOString(); all.push(e); this.set('exams',all); return e; },
  getMarks(eid,cid) { return this.gd(`marks_${eid}_${cid}`,{}); },
  saveMarks(eid,cid,m) { this.set(`marks_${eid}_${cid}`,m); },
  getTimetable(cid) { return this.gd('tt_'+cid,{}); },
  saveTimetable(cid,d) { this.set('tt_'+cid,d); },
  fmtDate(iso) { if(!iso)return''; return new Date(iso).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); },
  fmtMoney(n) { return '₹'+Number(n).toLocaleString('en-IN'); },
  today() { return new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); },
  toast(msg,type='success') {
    let el=document.getElementById('_toast');
    if(!el){el=document.createElement('div');el.id='_toast';el.style.cssText='position:fixed;top:80px;right:20px;z-index:9999;min-width:260px;';document.body.appendChild(el);}
    const icon=type==='success'?'✓':type==='danger'?'✕':'ℹ';
    el.innerHTML=`<div class="alert ${type}" style="box-shadow:0 4px 16px rgba(0,0,0,0.18);">${icon} ${msg}</div>`;
    setTimeout(()=>{el.innerHTML='';},3000);
  },
  openModal(id){document.getElementById(id)?.classList.add('show');},
  closeModal(id){document.getElementById(id)?.classList.remove('show');},
};
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-overlay'))e.target.classList.remove('show');});
