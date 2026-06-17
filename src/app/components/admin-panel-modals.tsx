import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './app-context';
import {
  NOTIFICATIONS, Customer, Deal, FinanceItem, Personnel, PERSONNEL_PERMISSIONS,
  toFa, STATUS_LABELS, STAGE_LABELS
} from './data';
import neuraLogo from "figma:asset/0ee60e1dbaa3bcb0e2daccbfdd0200ba026fb510.png";

export function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[12px] text-[var(--aw-text-muted)] mb-2 px-1" style={{ fontWeight: 600 }}>{title}</div>
      {children}
    </div>
  );
}

export function SettingsItem({ icon, label, onClick, danger }: { icon: string; label: string; onClick?: () => void; danger?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-xl mb-1 cursor-pointer transition-all border border-[var(--aw-border)] hover:border-[var(--aw-primary)]"
      style={{ background: 'var(--aw-bg-card)' }}
      onClick={onClick}
    >
      <i className={`${icon} text-base w-5 text-center`} style={{ color: danger ? 'var(--aw-danger)' : 'var(--aw-primary)' }} />
      <span className={`flex-1 text-[13px] ${danger ? 'text-[var(--aw-danger)]' : ''}`} style={{ fontWeight: 500 }}>{label}</span>
      <i className="fa-solid fa-chevron-left text-[12px] text-[var(--aw-text-muted)]" />
    </div>
  );
}

// ========================
// MODAL CONTENTS
// ========================
export function NotifItem({ notif: n, isRead, onMarkRead, onDelete }: { notif: any; isRead?: boolean; onMarkRead?: (id: string) => void; onDelete?: (id: string) => void }) {
  const { closeModal, openChat, setAdminScreen, setCrmTab, setFinTab, agents } = useApp();
  const handleClick = () => {
    closeModal();
    if (n.type === 'chat') {
      const a = agents.find((x: any) => x.id === n.target);
      if (a && !a.locked) setTimeout(() => openChat(n.target, 'agent'), 250);
    } else if (n.type === 'finance') {
      setAdminScreen('financeScreen');
      if (n.target === 'pending') setFinTab('invoices');
    } else if (n.type === 'crm') {
      setAdminScreen('crmScreen');
      if (n.target === 'leads') setCrmTab('leads');
    } else if (n.type === 'reports') {
      setAdminScreen('reportsScreen');
    }
  };

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl mb-1.5 cursor-pointer border transition-all hover:border-[var(--aw-primary)] ${isRead ? 'border-transparent opacity-60' : 'border-[var(--aw-border)]'}`} style={{ background: 'var(--aw-bg-card)' }} onClick={handleClick}>
      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-sm flex-shrink-0 ${n.iconBg}`}>
        <i className={`${n.icon} text-white`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {!isRead && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--aw-primary)' }} />}
          <div className="text-[13px] truncate" style={{ fontWeight: 600 }}>{n.title}</div>
        </div>
        <div className="text-[11px] text-[var(--aw-text-secondary)]">{n.desc}</div>
        <div className="text-[10px] text-[var(--aw-text-muted)] mt-1">{n.time}</div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] text-[var(--aw-primary)] inline-block" style={{ fontWeight: 600 }}>{n.cta} ←</span>
          <div className="flex-1" />
          {!isRead && onMarkRead && (
            <button
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] transition-all hover:opacity-80"
              style={{ background: 'var(--aw-bg-hover)', color: 'var(--aw-success)', fontWeight: 600 }}
              onClick={(e) => { e.stopPropagation(); onMarkRead(n.id); }}
            >
              <i className="fa-solid fa-check text-[9px]" />
              خوانده شد
            </button>
          )}
          {onDelete && (
            <button
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] transition-all hover:opacity-80"
              style={{ background: 'var(--aw-bg-hover)', color: 'var(--aw-danger)', fontWeight: 600 }}
              onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
            >
              <i className="fa-solid fa-trash text-[9px]" />
              حذف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationsContent() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const handleMarkRead = (id: string) => setReadIds(prev => new Set(prev).add(id));
  const handleDelete = (id: string) => setDeletedIds(prev => new Set(prev).add(id));
  const handleMarkAllRead = () => setReadIds(new Set(NOTIFICATIONS.map(n => n.id)));

  const visibleNotifs = NOTIFICATIONS.filter(n => !deletedIds.has(n.id));
  const unreadCount = visibleNotifs.filter(n => !readIds.has(n.id)).length;

  return (
    <div>
      {visibleNotifs.length > 0 && (
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] text-[var(--aw-text-muted)]">{toFa(unreadCount)} اعلان خوانده‌نشده</span>
          {unreadCount > 0 && (
            <button
              className="text-[11px] px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
              style={{ background: 'var(--aw-bg-hover)', color: 'var(--aw-primary)', fontWeight: 600 }}
              onClick={handleMarkAllRead}
            >
              <i className="fa-solid fa-check-double ml-1 text-[10px]" />
              خواندن همه
            </button>
          )}
        </div>
      )}
      <AnimatePresence>
        {visibleNotifs.map(n => (
          <motion.div key={n.id} initial={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.25 }}>
            <NotifItem notif={n} isRead={readIds.has(n.id)} onMarkRead={handleMarkRead} onDelete={handleDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
      {visibleNotifs.length === 0 && (
        <div className="text-center py-10 text-[var(--aw-text-muted)]">
          <i className="fa-solid fa-bell-slash text-3xl mb-3 block opacity-40" />
          <div className="text-[13px]">اعلانی وجود ندارد</div>
        </div>
      )}
    </div>
  );
}

export function SearchContent() {
  const [query, setQuery] = useState('');
  const { agents, personnel, customers, deals, closeModal, openChat, openModal } = useApp();

  const results: { name: string; sub: string; icon: string; bg: string; init: string; action: () => void }[] = [];

  if (query.trim()) {
    agents.filter(a => a.name.includes(query) || a.role.includes(query)).forEach(a => {
      results.push({
        name: a.name, sub: a.role, icon: 'fa-solid fa-robot', bg: a.bg, init: a.init,
        action: () => { closeModal(); if (!a.locked) setTimeout(() => openChat(a.id, 'agent'), 200); }
      });
    });
    personnel.filter(p => p.name.includes(query) || p.role.includes(query)).forEach(p => {
      results.push({
        name: p.name, sub: p.role, icon: 'fa-solid fa-user-tie', bg: p.bg, init: p.init,
        action: () => { closeModal(); setTimeout(() => openChat(p.id, 'personnel'), 200); }
      });
    });
    customers.filter(c => c.name.includes(query) || c.contact.includes(query)).forEach(c => {
      results.push({
        name: c.name, sub: c.contact, icon: 'fa-solid fa-user', bg: 'aw-bg-cyan', init: c.name[0],
        action: () => { closeModal(); setTimeout(() => openModal(c.name, <CustomerDetailContent customerId={c.id} />), 200); }
      });
    });
    deals.filter(d => d.title.includes(query) || d.customer.includes(query)).forEach(d => {
      results.push({
        name: d.title, sub: d.customer, icon: 'fa-solid fa-handshake', bg: 'aw-bg-green', init: d.title[0],
        action: () => { closeModal(); setTimeout(() => openModal(d.title, <DealDetailContent dealId={d.id} />), 200); }
      });
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2 rounded-[10px] px-3 border border-[var(--aw-border)]" style={{ background: 'var(--aw-bg-input)' }}>
        <i className="fa-solid fa-search text-sm text-[var(--aw-text-muted)]" />
        <input className="flex-1 bg-transparent border-none py-2.5 text-[13px] text-[var(--aw-text-primary)] outline-none placeholder:text-[var(--aw-text-muted)]" placeholder="جستجو در همه بخش‌ها..." value={query} onChange={e => setQuery(e.target.value)} autoFocus />
        {query && (
          <button className="bg-transparent border-none text-[var(--aw-text-muted)] cursor-pointer text-sm" onClick={() => setQuery('')}>
            <i className="fa-solid fa-times" />
          </button>
        )}
      </div>
      <div className="mt-3">
        {results.length > 0 ? results.map((r, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl mb-1 cursor-pointer border border-[var(--aw-border)] hover:border-[var(--aw-primary)]" style={{ background: 'var(--aw-bg-card)' }} onClick={r.action}>
            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-[11px] ${r.bg}`} style={{ fontWeight: 700 }}>{r.init}</div>
            <div className="flex-1">
              <span className="text-[13px]" style={{ fontWeight: 500 }}>{r.name}</span>
              <span className="text-[11px] text-[var(--aw-text-muted)] mr-2">— {r.sub}</span>
            </div>
          </div>
        )) : query ? <div className="text-center py-8 text-[var(--aw-text-muted)] text-[13px]">نتیجه‌ای یافت نشد</div> : (
          <div className="text-center py-8 text-[var(--aw-text-muted)] text-[13px]">عبارت مورد نظر را تایپ کنید...</div>
        )}
      </div>
    </div>
  );
}

export function SubscribeContent({ agentId }: { agentId: string }) {
  const { agents, setAgents, closeModal, showToast } = useApp();
  const a = agents.find(x => x.id === agentId);
  if (!a) return null;

  const activate = () => {
    setAgents(prev => prev.map(ag => ag.id === agentId ? { ...ag, locked: false, instructions: ag.instructions || 'دستورالعمل پیش‌فرض عامل ' + ag.name } : ag));
    closeModal();
    showToast(a.name + ' فعال شد!');
  };

  return (
    <div>
      <div className="text-center mb-5">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-[26px] mx-auto mb-2.5 ${a.bg}`} style={{ fontWeight: 700 }}>{a.init}</div>
        <h3 className="text-base">{a.name}</h3>
        <p className="text-[12px] text-[var(--aw-text-secondary)]">{a.role}</p>
      </div>
      <div className="rounded-xl p-4 mb-4 text-center border" style={{ background: 'var(--aw-primary-bg)', borderColor: 'var(--aw-primary)' }}>
        <div className="text-[24px] text-[var(--aw-primary)]" style={{ fontWeight: 800 }}>۴۹,۰۰۰</div>
        <div className="text-[12px] text-[var(--aw-text-secondary)]">تومان / ماهانه</div>
      </div>
      <ul className="list-none p-0 mb-4">
        {['پاسخ‌دهی ۲۴ ساعته', 'یکپارچه‌سازی با سیستم‌ها', 'گزارش‌گیری پیشرفته'].map(f => (
          <li key={f} className="py-1.5 text-[12px] flex items-center gap-1.5">
            <i className="fa-solid fa-check-circle text-[var(--aw-secondary)]" /> {f}
          </li>
        ))}
      </ul>
      <button className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={activate}>
        <i className="fa-solid fa-shopping-cart" /> خرید اشتراک
      </button>
    </div>
  );
}

export function CustomerDetailContent({ customerId }: { customerId: string }) {
  const { customers, setCustomers, closeModal, showToast, startCall, openChat } = useApp();
  const c = customers.find(x => x.id === customerId);
  if (!c) return null;

  const update = (field: keyof Customer, val: string) => {
    setCustomers(prev => prev.map(cu => cu.id === customerId ? { ...cu, [field]: val } : cu));
  };

  const handleDelete = () => {
    setCustomers(prev => prev.filter(cu => cu.id !== customerId));
    closeModal();
    showToast(c.name + ' حذف شد');
  };

  return (
    <div>
      <div className="text-center mb-4">
        <div className="aw-bg-cyan w-14 h-14 rounded-full flex items-center justify-center text-white text-[22px] mx-auto mb-2.5" style={{ fontWeight: 700 }}>{c.name[0]}</div>
        <h3 className="text-base">{c.name}</h3>
        <p className="text-[12px] text-[var(--aw-text-secondary)]">{STATUS_LABELS[c.status]}</p>
      </div>
      <FormGroup label="نام مخاطب"><FormInput value={c.contact} onChange={e => update('contact', e.target.value)} /></FormGroup>
      <FormGroup label="تلفن"><FormInput value={c.phone} onChange={e => update('phone', e.target.value)} /></FormGroup>
      <FormGroup label="ایمیل"><FormInput value={c.email} onChange={e => update('email', e.target.value)} /></FormGroup>
      <FormGroup label="وضعیت">
        <FormSelect value={c.status} onChange={e => update('status', e.target.value as any)} options={[{ value: 'active', label: 'فعال' }, { value: 'lead', label: 'سرنخ' }, { value: 'inactive', label: 'غیرفعال' }]} />
      </FormGroup>
      <div className="flex gap-2 mb-2">
        <button className="flex-1 py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-eu-primary)', fontWeight: 600 }}
          onClick={() => { closeModal(); setTimeout(() => openChat(customerId, 'customer'), 200); }}>
          <i className="fa-solid fa-comment" /> چت
        </button>
        <button className="flex-1 py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-secondary)', fontWeight: 600 }}
          onClick={() => { closeModal(); startCall(c.name, 'مشتری', 'aw-bg-cyan', c.name[0], ''); }}>
          <i className="fa-solid fa-phone" /> تماس
        </button>
      </div>
      <div className="flex gap-2 mb-2">
        <button className="flex-1 py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { closeModal(); showToast('تغییرات ذخیره شد'); }}>
          <i className="fa-solid fa-save" /> ذخیره
        </button>
      </div>
      <button className="w-full py-2 px-5 rounded-[10px] text-[12px] cursor-pointer border border-[var(--aw-danger)] text-[var(--aw-danger)] bg-transparent" style={{ fontWeight: 600 }} onClick={handleDelete}>
        <i className="fa-solid fa-trash" /> حذف مشتری
      </button>
    </div>
  );
}

export function DealDetailContent({ dealId }: { dealId: string }) {
  const { deals, setDeals, closeModal, showToast } = useApp();
  const d = deals.find(x => x.id === dealId);
  if (!d) return null;

  const update = (field: keyof Deal, val: string) => {
    setDeals(prev => prev.map(de => de.id === dealId ? { ...de, [field]: val } : de));
  };

  const handleDelete = () => {
    setDeals(prev => prev.filter(de => de.id !== dealId));
    closeModal();
    showToast('معامله حذف شد');
  };

  return (
    <div>
      <FormGroup label="عنوان"><FormInput value={d.title} onChange={e => update('title', e.target.value)} /></FormGroup>
      <FormGroup label="مشتری"><FormInput value={d.customer} onChange={e => update('customer', e.target.value)} /></FormGroup>
      <FormGroup label="ارزش"><FormInput value={d.value} onChange={e => update('value', e.target.value)} /></FormGroup>
      <FormGroup label="احتمال"><FormInput value={d.probability} onChange={e => update('probability', e.target.value)} /></FormGroup>
      <FormGroup label="مرحله">
        <FormSelect value={d.stage} onChange={e => update('stage', e.target.value as any)} options={[{ value: 'negotiation', label: 'مذاکره' }, { value: 'proposal', label: 'پیشن��اد' }, { value: 'closed', label: 'بسته شده' }]} />
      </FormGroup>
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { closeModal(); showToast('تغییرات ذخیره شد'); }}>ذخیره</button>
        <button className="py-2.5 px-5 rounded-[10px] text-[13px] cursor-pointer border border-[var(--aw-danger)] text-[var(--aw-danger)] bg-transparent" style={{ fontWeight: 600 }} onClick={handleDelete}>
          <i className="fa-solid fa-trash" />
        </button>
      </div>
    </div>
  );
}

export function NewChatContent() {
  const { chatTab, setChatTab, customers, setCustomers, personnel, setPersonnel, closeModal, showToast, openChat } = useApp();
  const [activeSection, setActiveSection] = useState<'add' | 'select'>('add');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const sectionTabs = chatTab === 'personnel'
    ? [
        { id: 'add' as const, label: 'افزودن پرسنل جدید', icon: 'fa-solid fa-user-plus' },
        { id: 'select' as const, label: 'انتخاب از لیست', icon: 'fa-solid fa-list' },
      ]
    : [
        { id: 'add' as const, label: 'افزودن مخاطب جدید', icon: 'fa-solid fa-user-plus' },
        { id: 'select' as const, label: 'انتخاب از لیست', icon: 'fa-solid fa-list' },
      ];

  const saveAndChat = () => {
    if (!name.trim()) return;
    if (chatTab === 'personnel') {
      const newId = 'p' + Date.now();
      const newPerson = {
        id: newId,
        name: name.trim(),
        role: role.trim() || 'کارمند',
        status: 'online' as const,
        bg: 'aw-bg-indigo',
        init: name.trim()[0],
        lastMsg: '',
        lastTime: 'الان',
        unread: 0,
        voip: phone.trim(),
      };
      setPersonnel(prev => [...prev, newPerson]);
      setChatTab('personnel');
      closeModal();
      showToast('پرسنل جدید اضافه شد');
      setTimeout(() => openChat(newId, 'personnel'), 100);
    } else {
      const newId = 'c' + Date.now();
      const newCustomer = {
        id: newId,
        name: name.trim(),
        contact: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        status: 'active' as const,
        value: '۰',
        lastContact: 'امروز',
      };
      setCustomers(prev => [...prev, newCustomer]);
      setChatTab('customers');
      closeModal();
      showToast('مخاطب جدید اضافه شد');
      setTimeout(() => openChat(newId, 'customer'), 100);
    }
  };

  const existingList = chatTab === 'personnel' ? personnel : customers;

  return (
    <div>
      {/* Section tabs */}
      <div className="flex gap-1 p-1 rounded-[10px] mb-4" style={{ background: 'var(--aw-bg-input)' }}>
        {sectionTabs.map(t => (
          <button
            key={t.id}
            className={`flex-1 py-2 text-center border-none rounded-lg text-[12px] cursor-pointer transition-all whitespace-nowrap ${
              activeSection === t.id ? 'text-white' : 'bg-transparent text-[var(--aw-text-muted)]'
            }`}
            style={activeSection === t.id ? { background: 'var(--aw-primary)', fontWeight: 600 } : { fontWeight: 600 }}
            onClick={() => setActiveSection(t.id)}
          >
            <i className={`${t.icon} ml-1 text-[10px]`} />
            {t.label}
          </button>
        ))}
      </div>

      {activeSection === 'add' ? (
        <div>
          <FormGroup label="نام">
            <FormInput placeholder="نام مخاطب را وارد کنید" value={name} onChange={e => setName(e.target.value)} />
          </FormGroup>
          {chatTab === 'personnel' && (
            <FormGroup label="سمت">
              <FormInput placeholder="سمت یا نقش" value={role} onChange={e => setRole(e.target.value)} />
            </FormGroup>
          )}
          <FormGroup label="شماره تماس">
            <FormInput placeholder="شماره تماس" value={phone} onChange={e => setPhone(e.target.value)} />
          </FormGroup>
          {chatTab !== 'personnel' && (
            <FormGroup label="ایمیل">
              <FormInput placeholder="ایمیل" value={email} onChange={e => setEmail(e.target.value)} />
            </FormGroup>
          )}
          <button
            className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--aw-primary)', fontWeight: 600 }}
            disabled={!name.trim()}
            onClick={saveAndChat}
          >
            <i className="fa-solid fa-plus ml-1.5" />
            {chatTab === 'personnel' ? 'افزودن و شروع گفتگو' : 'افزودن و شروع گفتگو'}
          </button>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto aw-scroll">
          {existingList.length === 0 && (
            <div className="text-center py-8 text-[var(--aw-text-muted)]">
              <i className="fa-solid fa-inbox text-[32px] opacity-30 block mb-3" />
              <p className="text-[13px]">لیست خالی است</p>
            </div>
          )}
          {existingList.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-[12px] cursor-pointer transition-all mb-1 border border-transparent hover:bg-[var(--aw-bg-card-hover)] hover:border-[var(--aw-primary)]"
              onClick={() => {
                closeModal();
                openChat(item.id, chatTab === 'personnel' ? 'personnel' : 'customer');
              }}
            >
              <div
                className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-white flex-shrink-0 ${item.bg || 'aw-bg-cyan'}`}
                style={{ fontWeight: 700, fontSize: 15 }}
              >
                {item.init || item.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px]" style={{ fontWeight: 600 }}>{item.name}</div>
                <div className="text-[11px] text-[var(--aw-text-muted)]">{item.role || item.contact || ''}</div>
              </div>
              <i className="fa-solid fa-comment-dots text-[var(--aw-primary)] text-sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CrmAddContent() {
  const { crmTab, customers, setCustomers, deals, setDeals, closeModal, showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Deal fields
  const [dealTitle, setDealTitle] = useState('');
  const [dealCustomer, setDealCustomer] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [dealStage, setDealStage] = useState<'negotiation' | 'proposal' | 'closed'>('negotiation');

  const saveCustomer = () => {
    if (!name) return;
    setCustomers(prev => [...prev, { id: 'c' + Date.now(), name, contact: name, phone, email, status: crmTab === 'leads' ? 'lead' as const : 'active' as const, value: '۰', lastContact: 'امروز' }]);
    closeModal();
    showToast((crmTab === 'leads' ? 'سرنخ' : 'مشتری') + ' جدید اضافه شد');
  };

  const saveDeal = () => {
    if (!dealTitle) return;
    setDeals(prev => [...prev, { id: 'd' + Date.now(), title: dealTitle, customer: dealCustomer, value: dealValue, stage: dealStage, probability: dealStage === 'closed' ? '۱۰۰٪' : '۵۰٪' }]);
    closeModal();
    showToast('معامله جدید اضافه شد');
  };

  if (crmTab === 'deals') {
    return (
      <div>
        <FormGroup label="عنوان معامله"><FormInput placeholder="عنوان معامله" value={dealTitle} onChange={e => setDealTitle(e.target.value)} /></FormGroup>
        <FormGroup label="مشتری">
          <FormSelect value={dealCustomer} onChange={e => setDealCustomer(e.target.value)} options={[{ value: '', label: 'انتخاب مشتری...' }, ...customers.map(c => ({ value: c.name, label: c.name }))]} />
        </FormGroup>
        <FormGroup label="ارزش (ریال)"><FormInput placeholder="مبلغ" value={dealValue} onChange={e => setDealValue(e.target.value)} /></FormGroup>
        <FormGroup label="مرحله">
          <FormSelect value={dealStage} onChange={e => setDealStage(e.target.value as any)} options={[{ value: 'negotiation', label: 'مذاکره' }, { value: 'proposal', label: 'پیشنهاد' }, { value: 'closed', label: 'بسته شده' }]} />
        </FormGroup>
        <button className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={saveDeal}>ذخیره معامله</button>
      </div>
    );
  }

  return (
    <div>
      <FormGroup label="نام"><FormInput placeholder="نام را وارد کنید" value={name} onChange={e => setName(e.target.value)} /></FormGroup>
      <FormGroup label="شماره تماس"><FormInput placeholder="شماره تماس" value={phone} onChange={e => setPhone(e.target.value)} /></FormGroup>
      <FormGroup label="ایمیل"><FormInput placeholder="ایمیل" value={email} onChange={e => setEmail(e.target.value)} /></FormGroup>
      <button className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={saveCustomer}>ذخیره</button>
    </div>
  );
}

export function FinDetailContent({ itemId }: { itemId: string }) {
  const { financeData, setFinanceData, closeModal, showToast } = useApp();
  const f = [...financeData.income, ...financeData.expense].find(x => x.id === itemId);
  if (!f) return null;

  const markPaid = () => {
    setFinanceData(prev => ({
      income: prev.income.map(fi => fi.id === itemId ? { ...fi, status: 'paid' as const } : fi),
      expense: prev.expense.map(fi => fi.id === itemId ? { ...fi, status: 'paid' as const } : fi),
    }));
    showToast('وضعیت به پرداخت شده تغییر یافت');
    closeModal();
  };

  return (
    <div>
      <div className="text-center mb-4">
        <div className="text-[28px]" style={{ fontWeight: 800, color: f.status === 'paid' ? 'var(--aw-secondary)' : 'var(--aw-accent)' }}>{f.amount}</div>
        <div className="text-[12px] text-[var(--aw-text-muted)]">ریال</div>
      </div>
      <FormGroup label="شرح"><div className="w-full p-2.5 rounded-[10px] text-[13px] border border-[var(--aw-border)]" style={{ background: 'var(--aw-bg-card)' }}>{f.desc}</div></FormGroup>
      <FormGroup label="تاریخ"><div className="w-full p-2.5 rounded-[10px] text-[13px] border border-[var(--aw-border)]" style={{ background: 'var(--aw-bg-card)' }}>{f.date}</div></FormGroup>
      <FormGroup label="دسته‌بندی"><div className="w-full p-2.5 rounded-[10px] text-[13px] border border-[var(--aw-border)]" style={{ background: 'var(--aw-bg-card)' }}>{f.category}</div></FormGroup>
      <FormGroup label="وضعیت">
        <div className="w-full p-2.5 rounded-[10px] text-[13px] border border-[var(--aw-border)]" style={{ background: 'var(--aw-bg-card)' }}>
          <span className="px-2 py-0.5 rounded-[20px] text-[10px]" style={{ background: f.status === 'paid' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: f.status === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
            {f.status === 'paid' ? 'پرداخت شده' : 'معوق'}
          </span>
        </div>
      </FormGroup>
      <div className="flex gap-2">
        {f.status === 'pending' && (
          <button className="flex-1 py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-secondary)', fontWeight: 600 }} onClick={markPaid}>
            <i className="fa-solid fa-check" /> تایید پرداخت
          </button>
        )}
        <button className="flex-1 py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={closeModal}>بستن</button>
      </div>
    </div>
  );
}

export function FinAddContent({ type }: { type: 'income' | 'expense' }) {
  const { setFinanceData, closeModal, showToast } = useApp();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const save = () => {
    if (!desc || !amount) return;
    const newItem: FinanceItem = {
      id: 'f' + Date.now(),
      desc,
      amount,
      date: 'امروز',
      status: 'pending',
      category: category || (type === 'income' ? 'فروش' : 'عمومی'),
    };
    setFinanceData(prev => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));
    closeModal();
    showToast((type === 'income' ? 'درآمد' : 'هزینه') + ' جدید ثبت شد');
  };

  return (
    <div>
      <FormGroup label="شرح"><FormInput placeholder="شرح تراکنش" value={desc} onChange={e => setDesc(e.target.value)} /></FormGroup>
      <FormGroup label="مبلغ (ریال)"><FormInput placeholder="مبلغ" value={amount} onChange={e => setAmount(e.target.value)} /></FormGroup>
      <FormGroup label="دسته‌بندی"><FormInput placeholder="دسته‌بندی" value={category} onChange={e => setCategory(e.target.value)} /></FormGroup>
      <button className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={save}>ثبت</button>
    </div>
  );
}

export function AgentSettingsContent() {
  const { agents, company, openModal, closeModal } = useApp();
  const companyAgents = agents.filter(a => !a.company || a.company === company);
  return (
    <div>
      {companyAgents.map(a => (
        <div key={a.id} className="flex items-center gap-3 p-3.5 rounded-xl mb-1 cursor-pointer border border-[var(--aw-border)] hover:border-[var(--aw-primary)]" style={{ background: 'var(--aw-bg-card)' }}
          onClick={() => { closeModal(); setTimeout(() => openModal('تنظیمات: ' + a.name, <SingleAgentSettings agentId={a.id} />), 200); }}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] ${a.bg}`} style={{ fontWeight: 700 }}>{a.init}</div>
          <span className="flex-1 text-[13px]" style={{ fontWeight: 500 }}>{a.name} — {a.role}</span>
          {a.locked && <span className="text-[10px] text-black px-2 py-0.5 rounded-md" style={{ background: 'var(--aw-accent)', fontWeight: 700 }}><i className="fa-solid fa-lock" /></span>}
          <i className="fa-solid fa-chevron-left text-[12px] text-[var(--aw-text-muted)]" />
        </div>
      ))}
    </div>
  );
}

export function SingleAgentSettings({ agentId }: { agentId: string }) {
  const { agents, setAgents, closeModal, showToast, openModal } = useApp();
  const a = agents.find(x => x.id === agentId);
  if (!a) return null;

  const update = (field: string, val: any) => {
    setAgents(prev => prev.map(ag => ag.id === agentId ? { ...ag, [field]: val } : ag));
  };

  return (
    <div>
      <div className="text-center mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-[26px] mx-auto mb-2.5 ${a.bg}`} style={{ fontWeight: 700 }}>{a.init}</div>
        <h3 className="text-base">{a.name}</h3>
        <p className="text-[12px] text-[var(--aw-text-secondary)]">{a.role}</p>
      </div>
      <button
        onClick={() => { closeModal(); setTimeout(() => openModal('شخصی‌سازی: ' + a.name, <CustomizeAgentContent agentId={agentId} />), 200); }}
        className="w-full flex items-center gap-3 p-3 rounded-xl mb-3 cursor-pointer border-none text-right"
        style={{ background: 'linear-gradient(135deg, #B83D9E15, #7E5FAA15)', border: '1px solid #B83D9E44' }}
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B83D9E, #7E5FAA)' }}>
          <i className="fa-solid fa-wand-magic-sparkles text-[13px] text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[12px]" style={{ fontWeight: 700, color: 'var(--aw-text-primary)' }}>شخصی‌سازی ایجنت</div>
          <div className="text-[10px] text-[var(--aw-text-muted)]">عکس، جنسیت، صدا، سن، لحن، شرایط ارجاع</div>
        </div>
        <i className="fa-solid fa-chevron-left text-[11px] text-[var(--aw-text-muted)]" />
      </button>
      <FormGroup label="نام عامل"><FormInput value={a.name} onChange={e => update('name', e.target.value)} /></FormGroup>
      <FormGroup label="نقش"><FormInput value={a.role} onChange={e => update('role', e.target.value)} /></FormGroup>
      <FormGroup label="شماره داخلی VoIP"><FormInput value={a.voip} onChange={e => update('voip', e.target.value)} /></FormGroup>
      <FormGroup label="دستورالعمل‌ها (Instructions)">
        <textarea className="w-full p-2.5 rounded-[10px] border border-[var(--aw-border)] text-[13px] text-[var(--aw-text-primary)] outline-none resize-y min-h-[80px]" style={{ background: 'var(--aw-bg-input)' }} value={a.instructions} onChange={e => update('instructions', e.target.value)} rows={4} />
      </FormGroup>
      <FormGroup label="وضعیت">
        <FormSelect value={String(a.locked)} onChange={e => update('locked', e.target.value === 'true')} options={[{ value: 'false', label: 'فعال' }, { value: 'true', label: 'قفل (نیاز به اشتراک)' }]} />
      </FormGroup>
      <button className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { closeModal(); showToast('تنظیمات ' + a.name + ' ذخیره شد'); }}>ذخیره و بستن</button>
    </div>
  );
}

const PERSONNEL_BG_OPTIONS = ['aw-bg-sky', 'aw-bg-emerald', 'aw-bg-amber', 'aw-bg-rose', 'aw-bg-purple', 'aw-bg-cyan', 'aw-bg-pink', 'aw-bg-indigo'];

export function PersonnelSettingsContent() {
  const { personnel, setPersonnel, openModal, closeModal, showToast } = useApp();
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const addNew = () => {
    const id = 'p' + Date.now();
    const newPerson: Personnel = {
      id, name: 'پرسنل جدید', role: 'نقش جدید', status: 'offline',
      bg: PERSONNEL_BG_OPTIONS[personnel.length % PERSONNEL_BG_OPTIONS.length],
      init: 'پ', lastMsg: '', lastTime: 'اکنون', unread: 0,
      voip: String(300 + personnel.length + 1),
      email: '', phone: '', permissions: ['dashboard'],
    };
    setPersonnel(prev => [...prev, newPerson]);
    showToast('پرسنل جدید اضافه شد');
    closeModal();
    setTimeout(() => openModal('تنظیمات: ' + newPerson.name, <SinglePersonnelSettings personnelId={id} />), 200);
  };

  const removePerson = (id: string, name: string) => {
    setPersonnel(prev => prev.filter(p => p.id !== id));
    setConfirmDel(null);
    showToast(`${name} حذف شد`);
  };

  return (
    <div>
      <button onClick={addNew}
        className="w-full mb-3 py-3 px-4 rounded-xl border-none text-white cursor-pointer flex items-center justify-center gap-2 text-[13px]"
        style={{ background: 'linear-gradient(135deg, var(--aw-primary), var(--aw-primary-dark))', fontWeight: 700 }}>
        <i className="fa-solid fa-user-plus text-[13px]" /> افزودن پرسنل جدید
      </button>

      {personnel.map(p => (
        <div key={p.id} className="rounded-xl mb-1.5 border border-[var(--aw-border)] hover:border-[var(--aw-primary)]" style={{ background: 'var(--aw-bg-card)' }}>
          <div className="flex items-center gap-3 p-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-[13px] ${p.bg}`} style={{ fontWeight: 700 }}>{p.init}</div>
            <div className="flex-1 min-w-0 cursor-pointer"
              onClick={() => { closeModal(); setTimeout(() => openModal('تنظیمات: ' + p.name, <SinglePersonnelSettings personnelId={p.id} />), 200); }}>
              <div className="text-[13px] text-[var(--aw-text-primary)]" style={{ fontWeight: 600 }}>{p.name}</div>
              <div className="text-[10px] text-[var(--aw-text-muted)]">{p.role} · {toFa((p.permissions || []).length)} سطح دسترسی</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.status === 'online' ? 'var(--aw-online)' : 'var(--aw-offline)' }} />
            <button className="w-8 h-8 rounded-lg border border-[var(--aw-border)] bg-transparent cursor-pointer flex items-center justify-center text-[var(--aw-primary)]"
              onClick={() => { closeModal(); setTimeout(() => openModal('تنظیمات: ' + p.name, <SinglePersonnelSettings personnelId={p.id} />), 200); }}
              title="ویرایش">
              <i className="fa-solid fa-pen text-[11px]" />
            </button>
            <button className="w-8 h-8 rounded-lg border border-[var(--aw-border)] bg-transparent cursor-pointer flex items-center justify-center text-[#EF4444]"
              onClick={() => setConfirmDel(confirmDel === p.id ? null : p.id)}
              title="حذف">
              <i className="fa-solid fa-trash text-[11px]" />
            </button>
          </div>
          <AnimatePresence>
            {confirmDel === p.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="px-3 pb-3 flex items-center gap-2 border-t border-[var(--aw-border)] pt-2">
                <span className="flex-1 text-[11px] text-[var(--aw-text-secondary)]">آیا از حذف {p.name} مطمئن هستید؟</span>
                <button className="px-3 py-1.5 rounded-lg border-none text-white cursor-pointer text-[11px]" style={{ background: '#EF4444', fontWeight: 600 }}
                  onClick={() => removePerson(p.id, p.name)}>حذف</button>
                <button className="px-3 py-1.5 rounded-lg border border-[var(--aw-border)] bg-transparent cursor-pointer text-[11px] text-[var(--aw-text-secondary)]"
                  onClick={() => setConfirmDel(null)}>انصراف</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function SinglePersonnelSettings({ personnelId }: { personnelId: string }) {
  const { personnel, setPersonnel, closeModal, showToast } = useApp();
  const p = personnel.find(x => x.id === personnelId);
  if (!p) return null;

  const update = (field: string, val: any) => {
    setPersonnel(prev => prev.map(pe => pe.id === personnelId ? { ...pe, [field]: val } : pe));
  };

  return (
    <div>
      <div className="text-center mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-[26px] mx-auto mb-2.5 ${p.bg}`} style={{ fontWeight: 700 }}>{p.init}</div>
        <h3 className="text-base">{p.name}</h3>
        <p className="text-[12px] text-[var(--aw-text-secondary)]">{p.role}</p>
      </div>
      <FormGroup label="نقش"><FormInput value={p.role} onChange={e => update('role', e.target.value)} /></FormGroup>
      <FormGroup label="شماره موبایل / کد ملی"><FormInput value={p.phone || ''} onChange={e => update('phone', e.target.value)} /></FormGroup>

      {/* Access permissions */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[12px] text-[var(--aw-text-secondary)] flex items-center gap-1.5" style={{ fontWeight: 600 }}>
            <i className="fa-solid fa-shield-halved text-[11px] text-[var(--aw-primary)]" />
            سطح دسترسی
          </label>
          <div className="flex items-center gap-1.5">
            <button className="text-[10px] px-2 py-1 rounded-md border border-[var(--aw-border)] bg-transparent cursor-pointer text-[var(--aw-text-secondary)]"
              onClick={() => update('permissions', PERSONNEL_PERMISSIONS.map(x => x.id))}>انتخاب همه</button>
            <button className="text-[10px] px-2 py-1 rounded-md border border-[var(--aw-border)] bg-transparent cursor-pointer text-[var(--aw-text-secondary)]"
              onClick={() => update('permissions', [])}>حذف همه</button>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--aw-border)] overflow-hidden" style={{ background: 'var(--aw-bg-card)' }}>
          {PERSONNEL_PERMISSIONS.map((perm, i) => {
            const checked = (p.permissions || []).includes(perm.id);
            return (
              <div key={perm.id}
                className={`flex items-center gap-3 p-3 cursor-pointer ${i < PERSONNEL_PERMISSIONS.length - 1 ? 'border-b border-[var(--aw-border)]' : ''}`}
                onClick={() => {
                  const current = p.permissions || [];
                  update('permissions', checked ? current.filter(x => x !== perm.id) : [...current, perm.id]);
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: perm.color + '20' }}>
                  <i className={`${perm.icon} text-[12px]`} style={{ color: perm.color }} />
                </div>
                <span className="flex-1 text-[12px] text-[var(--aw-text-primary)]" style={{ fontWeight: 500 }}>{perm.label}</span>
                <div className="w-9 h-5 rounded-full relative transition-colors" style={{ background: checked ? perm.color : 'var(--aw-border)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ [checked ? 'left' : 'right']: '2px' } as any} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-[10px] text-[var(--aw-text-muted)] mt-1.5 flex items-center gap-1">
          <i className="fa-solid fa-circle-info text-[9px]" />
          {toFa((p.permissions || []).length)} از {toFa(PERSONNEL_PERMISSIONS.length)} دسترسی فعال است
        </div>
      </div>

      <button className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { closeModal(); showToast('تنظیمات ' + p.name + ' ذخیره شد'); }}>ذخیره و بستن</button>
    </div>
  );
}

export function ProfileContent() {
  const { role, userProfile, euProfile, setUserProfile, setEuProfile, closeModal, showToast, agents, customers } = useApp();
  const prof = role === 'admin' ? userProfile : euProfile;
  const setProfFn = role === 'admin' ? setUserProfile : setEuProfile;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [verifyStep, setVerifyStep] = useState<0 | 1 | 2 | 3>(0); // 0=hidden, 1=phone, 2=code, 3=success
  const [verifyCode, setVerifyCode] = useState('');
  const [usernameDraft, setUsernameDraft] = useState(prof.username);

  const onAvatarPick = (file: File) => {
    if (!file.type.startsWith('image/')) { showToast('فقط فایل تصویری مجاز است'); return; }
    if (file.size > 2 * 1024 * 1024) { showToast('حجم تصویر باید کمتر از ۲ مگابایت باشد'); return; }
    const reader = new FileReader();
    reader.onload = () => setProfFn(p => ({ ...p, avatarImage: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const removeAvatarImage = () => setProfFn(p => ({ ...p, avatarImage: undefined }));

  const startVerify = () => { setVerifyStep(1); setVerifyCode(''); };
  const sendCode = () => { setVerifyStep(2); showToast('کد تأیید به موبایل ارسال شد'); };
  const confirmCode = () => {
    if (verifyCode.replace(/[^0-9۰-۹]/g, '').length < 4) { showToast('کد ۴ رقمی را وارد کنید'); return; }
    setProfFn(p => ({ ...p, verified: true }));
    setVerifyStep(3);
    showToast('احراز هویت با موفقیت انجام شد');
  };

  return (
    <div>
      {/* Avatar with edit overlay */}
      <div className="text-center mb-4">
        <div className="relative w-24 h-24 mx-auto mb-3">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-[32px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--aw-primary), var(--aw-primary-dark))', fontWeight: 700 }}>
            {prof.avatarImage
              ? <img src={prof.avatarImage} alt={prof.name} className="w-full h-full object-cover" />
              : prof.avatar}
          </div>
          <button
            className="absolute bottom-0 left-0 w-8 h-8 rounded-full border-2 border-[var(--aw-bg-card)] cursor-pointer flex items-center justify-center text-white"
            style={{ background: 'var(--aw-primary)' }}
            onClick={() => fileInputRef.current?.click()}
            title="تغییر آواتار"
          >
            <i className="fa-solid fa-camera text-[12px]" />
          </button>
          {prof.avatarImage && (
            <button
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-[var(--aw-bg-card)] cursor-pointer flex items-center justify-center text-white bg-red-500"
              onClick={removeAvatarImage}
              title="حذف تصویر"
            >
              <i className="fa-solid fa-trash text-[11px]" />
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) onAvatarPick(f); e.currentTarget.value = ''; }} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="text-lg">{prof.name}</div>
          {prof.verified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontWeight: 700 }}>
              <i className="fa-solid fa-circle-check text-[10px]" /> احراز شده
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontWeight: 700 }}>
              <i className="fa-solid fa-circle-exclamation text-[10px]" /> احراز نشده
            </span>
          )}
        </div>
        <div className="text-[12px] text-[var(--aw-text-secondary)] mt-1">{prof.role}</div>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-center"><div className="text-xl text-[var(--aw-secondary)]" style={{ fontWeight: 800 }}>{toFa(agents.filter(a => !a.locked).length)}</div><div className="text-[10px] text-[var(--aw-text-muted)]">عامل فعال</div></div>
          <div className="text-center"><div className="text-xl text-[var(--aw-primary)]" style={{ fontWeight: 800 }}>{toFa(customers.length)}</div><div className="text-[10px] text-[var(--aw-text-muted)]">مشتری</div></div>
        </div>
      </div>

      {/* Verification flow */}
      {!prof.verified && (
        <div className="mb-4 rounded-[12px] border p-3"
          style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.30)' }}>
          <div className="flex items-center gap-2 mb-2">
            <i className="fa-solid fa-shield-halved text-[14px]" style={{ color: '#EF4444' }} />
            <span className="text-[13px] text-[var(--aw-text-primary)]" style={{ fontWeight: 700 }}>احراز هویت لازم است</span>
          </div>
          <div className="text-[11.5px] text-[var(--aw-text-secondary)] leading-6 mb-2.5">
            برای استفاده از تمامی امکانات، هویت خود را با کد پیامکی تأیید کنید.
          </div>

          {verifyStep === 0 && (
            <button className="w-full py-2 px-4 border-none rounded-[10px] text-[12px] text-white cursor-pointer"
              style={{ background: '#EF4444', fontWeight: 700 }} onClick={startVerify}>
              شروع احراز هویت
            </button>
          )}

          {verifyStep === 1 && (
            <div>
              <div className="text-[11px] text-[var(--aw-text-muted)] mb-1.5">شماره موبایل</div>
              <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-[10px] border border-[var(--aw-border)]"
                style={{ background: 'var(--aw-bg-input)' }}>
                <i className="fa-solid fa-mobile-screen text-[12px] text-[var(--aw-text-muted)]" />
                <span className="text-[13px]" style={{ fontWeight: 600 }}>{prof.phone}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 border-none rounded-[10px] text-[12px] text-white cursor-pointer"
                  style={{ background: 'var(--aw-primary)', fontWeight: 700 }} onClick={sendCode}>
                  <i className="fa-solid fa-paper-plane text-[10px] ml-1" /> ارسال کد
                </button>
                <button className="px-4 rounded-[10px] border border-[var(--aw-border)] bg-transparent text-[12px] cursor-pointer text-[var(--aw-text-secondary)]"
                  onClick={() => setVerifyStep(0)}>انصراف</button>
              </div>
            </div>
          )}

          {verifyStep === 2 && (
            <div>
              <div className="text-[11px] text-[var(--aw-text-muted)] mb-1.5">کد ۴ رقمی پیامک شده را وارد کنید</div>
              <input
                className="w-full text-center tracking-[8px] py-2.5 rounded-[10px] border border-[var(--aw-border)] text-[18px] text-[var(--aw-text-primary)] outline-none mb-2"
                style={{ background: 'var(--aw-bg-input)', fontWeight: 700, letterSpacing: '8px' }}
                placeholder="----"
                maxLength={4}
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value.replace(/[^0-9۰-۹]/g, '').slice(0, 4))}
              />
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 border-none rounded-[10px] text-[12px] text-white cursor-pointer"
                  style={{ background: '#10B981', fontWeight: 700 }} onClick={confirmCode}>
                  <i className="fa-solid fa-check text-[10px] ml-1" /> تأیید کد
                </button>
                <button className="px-4 rounded-[10px] border border-[var(--aw-border)] bg-transparent text-[12px] cursor-pointer text-[var(--aw-text-secondary)]"
                  onClick={() => setVerifyStep(1)}>بازگشت</button>
              </div>
            </div>
          )}
        </div>
      )}

      {verifyStep === 3 && (
        <div className="mb-4 rounded-[12px] border p-3 flex items-center gap-2"
          style={{ background: 'rgba(16,185,129,0.10)', borderColor: 'rgba(16,185,129,0.35)' }}>
          <i className="fa-solid fa-circle-check text-[16px]" style={{ color: '#10B981' }} />
          <span className="text-[12px] text-[var(--aw-text-primary)]" style={{ fontWeight: 700 }}>هویت شما با موفقیت احراز شد.</span>
        </div>
      )}

      {/* Read-only name */}
      <FormGroup label="نام">
        <FormInput value={prof.name} readOnly />
      </FormGroup>

      {/* Username (editable) */}
      <FormGroup label="نام کاربری">
        <FormInput
          value={usernameDraft}
          onChange={e => setUsernameDraft(e.target.value.replace(/\s+/g, '_'))}
          placeholder="مثلاً: ali_neura"
        />
      </FormGroup>

      <FormGroup label="ایمیل">
        <FormInput value={prof.email} onChange={e => setProfFn(p => ({ ...p, email: e.target.value }))} />
      </FormGroup>

      {/* Read-only phone */}
      <FormGroup label="تلفن">
        <FormInput value={prof.phone} readOnly />
      </FormGroup>

      <FormGroup label="بیوگرافی">
        <textarea className="w-full p-2.5 rounded-[10px] border border-[var(--aw-border)] text-[13px] text-[var(--aw-text-primary)] outline-none resize-y min-h-[80px]" style={{ background: 'var(--aw-bg-input)' }} value={prof.bio} onChange={e => setProfFn(p => ({ ...p, bio: e.target.value }))} rows={3} />
      </FormGroup>

      <button className="w-full py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer"
        style={{ background: 'var(--aw-primary)', fontWeight: 600 }}
        onClick={() => {
          const trimmed = usernameDraft.trim();
          if (!trimmed) { showToast('نام کاربری نمی‌تواند خالی باشد'); return; }
          setProfFn(p => ({ ...p, username: trimmed }));
          closeModal();
          showToast('پروفایل با موفقیت ذخیره شد');
        }}>
        ذخیره تغییرات
      </button>
    </div>
  );
}

// ========================
// AI Agent Management Content Modals
// ========================
const AGENT_MARKETPLACE = [
  { id: 'm1', name: 'منشی هوشمند', role: 'مدیریت تقویم، جلسات و تماس‌ها', price: '۱.۲M ت / ماه', icon: 'fa-solid fa-headset', color: '#3B82F6', rating: 4.9, hires: 1240 },
  { id: 'm2', name: 'بازاریاب AI', role: 'کمپین، تحلیل لید و سئو محتوا', price: '۲.۵M ت / ماه', icon: 'fa-solid fa-bullhorn', color: '#EC4899', rating: 4.7, hires: 890 },
  { id: 'm3', name: 'تحلیلگر فروش', role: 'پیش‌بینی فروش و تحلیل قیف', price: '۱.۸M ت / ماه', icon: 'fa-solid fa-chart-line', color: '#10B981', rating: 4.8, hires: 670 },
  { id: 'm4', name: 'پشتیبان مشتری', role: 'پاسخ ۲۴ ساعته به سوالات', price: '۹۰۰K ت / ماه', icon: 'fa-solid fa-life-ring', color: '#F59E0B', rating: 4.6, hires: 2100 },
  { id: 'm5', name: 'حسابدار AI', role: 'صدور فاکتور و گزارش مالی', price: '۲.۲M ت / ماه', icon: 'fa-solid fa-calculator', color: '#8B5CF6', rating: 4.5, hires: 540 },
  { id: 'm6', name: 'تدارکات هوشمند', role: 'مدیریت موجودی و سفارش خرید', price: '۱.۵M ت / ماه', icon: 'fa-solid fa-truck-field', color: '#F97316', rating: 4.7, hires: 430 },
];

export function HireAgentContent() {
  const { showToast, closeModal } = useApp();
  const [search, setSearch] = useState('');
  const filtered = AGENT_MARKETPLACE.filter(a => !search || a.name.includes(search) || a.role.includes(search));
  return (
    <div>
      <div className="p-3 rounded-xl mb-3 flex items-center gap-2.5" style={{ background: 'linear-gradient(135deg, #B83D9E22, #7E5FAA22)', border: '1px solid #B83D9E44' }}>
        <i className="fa-solid fa-store text-[18px]" style={{ color: '#B83D9E' }} />
        <div className="flex-1">
          <div className="text-[12px]" style={{ fontWeight: 700 }}>مارکت‌پلیس ایجنت‌های Neura</div>
          <div className="text-[10px] text-[var(--aw-text-muted)]">عامل هوشمند مناسب کسب‌وکار خود را انتخاب و استخدام کنید</div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: 'var(--aw-bg-input)', border: '1px solid var(--aw-border)' }}>
        <i className="fa-solid fa-magnifying-glass text-[11px] text-[var(--aw-text-muted)]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو در ایجنت‌ها..." className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--aw-text-primary)]" />
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map(a => (
          <div key={a.id} className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--aw-bg-card)', border: '1px solid var(--aw-border)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)` }}>
              <i className={`${a.icon} text-[18px]`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px]" style={{ fontWeight: 700 }}>{a.name}</div>
              <div className="text-[10px] text-[var(--aw-text-muted)] mb-1">{a.role}</div>
              <div className="flex items-center gap-2 text-[10px]">
                <span style={{ color: '#FFD700' }}><i className="fa-solid fa-star text-[9px] ml-0.5" />{a.rating}</span>
                <span className="text-[var(--aw-text-muted)]">·</span>
                <span className="text-[var(--aw-text-muted)]">{a.hires.toLocaleString('fa-IR')} استخدام</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px]" style={{ color: a.color, fontWeight: 700 }}>{a.price}</span>
              <button className="px-3 py-1 rounded-md border-none cursor-pointer text-[10px] text-white" style={{ background: a.color, fontWeight: 600 }} onClick={() => { showToast(`${a.name} با موفقیت استخدام شد ✅`, 'success'); closeModal(); }}>استخدام</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomizeAgentContent({ agentId }: { agentId?: string } = {}) {
  const { agents, company, showToast, closeModal } = useApp();
  const companyAgents = agents.filter(a => !a.company || a.company === company);
  const [selected, setSelected] = useState(agentId || companyAgents[0]?.id || '');
  const a = companyAgents.find(x => x.id === selected);
  const [tone, setTone] = useState('صمیمی');
  const [lang, setLang] = useState('فارسی');
  const [gender, setGender] = useState('زن');
  const VOICES_BY_GENDER: Record<string, string[]> = {
    'زن': ['زن - گرم', 'زن - رسمی', 'زن - جوان'],
    'مرد': ['مرد - عمیق', 'مرد - دوستانه', 'مرد - جوان'],
  };
  const [voice, setVoice] = useState(VOICES_BY_GENDER['زن'][0]);
  const onGenderChange = (g: string) => {
    setGender(g);
    setVoice(VOICES_BY_GENDER[g][0]);
    showToast(`صدا به «${VOICES_BY_GENDER[g][0]}» تنظیم شد`, 'info');
  };
  const [age, setAge] = useState('جوان');
  const AVATAR_PRESETS = [
    { id: 'a1', emoji: '🤖', bg: 'linear-gradient(135deg, #B83D9E, #7E5FAA)' },
    { id: 'a2', emoji: '👩‍💼', bg: 'linear-gradient(135deg, #EC4899, #F472B6)' },
    { id: 'a3', emoji: '👨‍💼', bg: 'linear-gradient(135deg, #3B82F6, #1E40AF)' },
    { id: 'a4', emoji: '🧑‍🎓', bg: 'linear-gradient(135deg, #10B981, #047857)' },
    { id: 'a5', emoji: '🦸', bg: 'linear-gradient(135deg, #F59E0B, #B45309)' },
    { id: 'a6', emoji: '🧙', bg: 'linear-gradient(135deg, #7E5FAA, #4C1D95)' },
  ];
  const [avatarPreset, setAvatarPreset] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [handoff, setHandoff] = useState<Record<string, boolean>>({
    angry: true,
    complex: true,
    finance: true,
    legal: false,
    userRequest: true,
    repeat: false,
  });
  const HANDOFF_RULES = [
    { id: 'angry', label: 'تعامل عصبانی یا ناراضی', icon: 'fa-solid fa-face-angry', color: '#EF4444' },
    { id: 'complex', label: 'سوال خارج از دانش ایجنت', icon: 'fa-solid fa-circle-question', color: '#F59E0B' },
    { id: 'finance', label: 'مطرح شدن موضوعات مالی', icon: 'fa-solid fa-sack-dollar', color: '#EC4899' },
    { id: 'legal', label: 'موضوعات حقوقی و قراردادی', icon: 'fa-solid fa-gavel', color: '#7E5FAA' },
    { id: 'userRequest', label: 'درخواست طرف مقابل برای صحبت با انسان', icon: 'fa-solid fa-hand', color: '#10B981' },
    { id: 'repeat', label: 'تکرار سوال بیش از ۳ بار', icon: 'fa-solid fa-repeat', color: '#3B82F6' },
  ];
  return (
    <div>
      {!agentId && (
        <FormGroup label="انتخاب ایجنت">
          <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full py-2.5 px-3.5 rounded-[10px] border border-[var(--aw-border)] text-[13px] text-[var(--aw-text-primary)] outline-none" style={{ background: 'var(--aw-bg-input)' }}>
            {companyAgents.map(ag => <option key={ag.id} value={ag.id}>{ag.name} — {ag.role}</option>)}
          </select>
        </FormGroup>
      )}
      {a && (
        <>
          <div className="p-3 rounded-xl mb-3 flex items-center gap-3" style={{ background: 'var(--aw-bg-card)', border: '1px solid var(--aw-border)' }}>
            <div className="relative">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-[20px] ${a.bg}`} style={{ fontWeight: 700 }}>{a.init}</div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--aw-primary)', border: '2px solid var(--aw-bg-card)' }}>
                <i className="fa-solid fa-camera text-[9px] text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[13px]" style={{ fontWeight: 700 }}>{a.name}</div>
              <div className="text-[11px] text-[var(--aw-text-muted)]">{a.role}</div>
            </div>
          </div>
          <FormGroup label="تغییر عکس پروفایل">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => showToast('انتخاب از گالری', 'info')} className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-[10px] border cursor-pointer" style={{ background: 'var(--aw-bg-card)', borderColor: 'var(--aw-border)', color: 'var(--aw-text-primary)' }}>
                <i className="fa-solid fa-images text-[14px]" style={{ color: 'var(--aw-primary)' }} />
                <span className="text-[11px]" style={{ fontWeight: 600 }}>گالری</span>
              </button>
              <button onClick={() => showToast('باز کردن دوربین', 'info')} className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-[10px] border cursor-pointer" style={{ background: 'var(--aw-bg-card)', borderColor: 'var(--aw-border)', color: 'var(--aw-text-primary)' }}>
                <i className="fa-solid fa-camera-retro text-[14px]" style={{ color: 'var(--aw-primary)' }} />
                <span className="text-[11px]" style={{ fontWeight: 600 }}>دوربین</span>
              </button>
              <button onClick={() => setShowAvatarPicker(v => !v)} className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-[10px] border cursor-pointer" style={{ background: showAvatarPicker ? 'var(--aw-primary)' : 'var(--aw-bg-card)', borderColor: showAvatarPicker ? 'var(--aw-primary)' : 'var(--aw-border)', color: showAvatarPicker ? '#fff' : 'var(--aw-text-primary)' }}>
                <i className="fa-solid fa-user-astronaut text-[14px]" style={{ color: showAvatarPicker ? '#fff' : 'var(--aw-primary)' }} />
                <span className="text-[11px]" style={{ fontWeight: 600 }}>آواتار</span>
              </button>
            </div>
            {showAvatarPicker && (
              <div className="grid grid-cols-6 gap-2 mt-2 p-2.5 rounded-xl" style={{ background: 'var(--aw-bg-input)', border: '1px solid var(--aw-border)' }}>
                {AVATAR_PRESETS.map(av => (
                  <button key={av.id} onClick={() => { setAvatarPreset(av.id); showToast('آواتار انتخاب شد', 'success'); }} className="w-full aspect-square rounded-full flex items-center justify-center text-[18px] cursor-pointer border-2" style={{ background: av.bg, borderColor: avatarPreset === av.id ? 'var(--aw-primary)' : 'transparent' }}>
                    {av.emoji}
                  </button>
                ))}
              </div>
            )}
          </FormGroup>
          <FormGroup label="جنسیت ایجنت (تعیین صدا)">
            <div className="flex gap-1.5 flex-wrap">
              {[{ v: 'زن', i: 'fa-solid fa-venus' }, { v: 'مرد', i: 'fa-solid fa-mars' }].map(g => (
                <button key={g.v} onClick={() => onGenderChange(g.v)} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border-none cursor-pointer" style={gender === g.v ? { background: 'var(--aw-primary)', color: '#fff', fontWeight: 600 } : { background: 'var(--aw-bg-card)', color: 'var(--aw-text-secondary)', border: '1px solid var(--aw-border)' }}>
                  <i className={`${g.i} text-[10px]`} />{g.v}
                </button>
              ))}
            </div>
            <div className="mt-2 p-2 rounded-lg flex items-center gap-2" style={{ background: 'var(--aw-bg-input)', border: '1px solid var(--aw-border)' }}>
              <i className="fa-solid fa-volume-high text-[11px]" style={{ color: 'var(--aw-primary)' }} />
              <span className="text-[10px] text-[var(--aw-text-secondary)]">صدای فعلی:</span>
              <span className="text-[11px]" style={{ fontWeight: 700, color: 'var(--aw-primary)' }}>{voice}</span>
              <button onClick={() => showToast('پخش نمونه صدا', 'info')} className="mr-auto px-2 py-0.5 rounded-md border-none cursor-pointer text-[10px] text-white" style={{ background: 'var(--aw-primary)', fontWeight: 600 }}>
                <i className="fa-solid fa-play text-[9px] ml-1" />نمونه
              </button>
            </div>
          </FormGroup>
          <FormGroup label="سن و سال">
            <div className="flex gap-1.5 flex-wrap">
              {['جوان', 'میانسال', 'مسن'].map(s => (
                <button key={s} onClick={() => setAge(s)} className="text-[11px] px-3 py-1.5 rounded-full border-none cursor-pointer" style={age === s ? { background: 'var(--aw-primary)', color: '#fff', fontWeight: 600 } : { background: 'var(--aw-bg-card)', color: 'var(--aw-text-secondary)', border: '1px solid var(--aw-border)' }}>{s}</button>
              ))}
            </div>
          </FormGroup>
          <FormGroup label="لحن گفتگو">
            <div className="flex gap-1.5 flex-wrap">
              {['محاوره‌ای کنترل‌شده', 'صمیمی', 'رسمی'].map(t => (
                <button key={t} onClick={() => setTone(t)} className="text-[11px] px-3 py-1.5 rounded-full border-none cursor-pointer" style={tone === t ? { background: 'var(--aw-primary)', color: '#fff', fontWeight: 600 } : { background: 'var(--aw-bg-card)', color: 'var(--aw-text-secondary)', border: '1px solid var(--aw-border)' }}>{t}</button>
              ))}
            </div>
          </FormGroup>
          <FormGroup label="زبان">
            <div className="flex gap-1.5 flex-wrap">
              {['فارسی', 'انگلیسی', 'عربی', 'دو زبانه'].map(l => (
                <button key={l} onClick={() => setLang(l)} className="text-[11px] px-3 py-1.5 rounded-full border-none cursor-pointer" style={lang === l ? { background: 'var(--aw-primary)', color: '#fff', fontWeight: 600 } : { background: 'var(--aw-bg-card)', color: 'var(--aw-text-secondary)', border: '1px solid var(--aw-border)' }}>{l}</button>
              ))}
            </div>
          </FormGroup>
          <FormGroup label={`صدای ایجنت (${gender})`}>
            <div className="flex gap-1.5 flex-wrap">
              {VOICES_BY_GENDER[gender].map(v => (
                <button key={v} onClick={() => setVoice(v)} className="text-[11px] px-3 py-1.5 rounded-full border-none cursor-pointer" style={voice === v ? { background: 'var(--aw-primary)', color: '#fff', fontWeight: 600 } : { background: 'var(--aw-bg-card)', color: 'var(--aw-text-secondary)', border: '1px solid var(--aw-border)' }}>{v}</button>
              ))}
            </div>
          </FormGroup>
          <FormGroup label="پیام خوش‌آمد">
            <textarea defaultValue={`سلام! من ${a.name} هستم. چطور می‌تونم کمکتون کنم؟`} rows={3} className="w-full p-2.5 rounded-[10px] border border-[var(--aw-border)] text-[13px] text-[var(--aw-text-primary)] outline-none resize-y" style={{ background: 'var(--aw-bg-input)' }} />
          </FormGroup>
          <FormGroup label="شرایط ارجاع به اپراتور انسانی">
            <div className="p-2.5 rounded-xl mb-2 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #B83D9E15, #7E5FAA15)', border: '1px solid #B83D9E33' }}>
              <i className="fa-solid fa-headset text-[12px]" style={{ color: '#B83D9E' }} />
              <span className="text-[10px] text-[var(--aw-text-secondary)]">در صورت فعال بودن، گفتگو به‌صورت خودکار به اپراتور انسانی منتقل می‌شود</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {HANDOFF_RULES.map(r => (
                <div key={r.id} className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: 'var(--aw-bg-card)', border: '1px solid var(--aw-border)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${r.color}1A` }}>
                    <i className={`${r.icon} text-[12px]`} style={{ color: r.color }} />
                  </div>
                  <span className="flex-1 text-[12px]" style={{ fontWeight: 600 }}>{r.label}</span>
                  <button onClick={() => setHandoff(prev => ({ ...prev, [r.id]: !prev[r.id] }))} className="relative w-9 h-5 rounded-full border-none cursor-pointer transition-all" style={{ background: handoff[r.id] ? '#10B981' : 'var(--aw-bg-input)' }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: '#fff', [handoff[r.id] ? 'left' : 'right']: 2 }} />
                  </button>
                </div>
              ))}
            </div>
          </FormGroup>
        </>
      )}
      <button className="w-full py-2.5 rounded-[10px] border-none text-white cursor-pointer text-[13px]" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { showToast('شخصی‌سازی ذخیره شد', 'success'); closeModal(); }}>ذخیره تنظیمات</button>
    </div>
  );
}

export function PermissionsContent() {
  const { agents, company, showToast, closeModal } = useApp();
  const companyAgents = agents.filter(a => !a.company || a.company === company);
  const PERMISSIONS = [
    { id: 'chat', label: 'گفتگو با مشتری', icon: 'fa-solid fa-comments' },
    { id: 'call', label: 'تماس صوتی/تصویری', icon: 'fa-solid fa-phone' },
    { id: 'invoice', label: 'صدور فاکتور', icon: 'fa-solid fa-file-invoice' },
    { id: 'refund', label: 'تایید مرجوعی', icon: 'fa-solid fa-rotate-left' },
    { id: 'discount', label: 'اعمال تخفیف', icon: 'fa-solid fa-tag' },
    { id: 'data', label: 'دسترسی به داده مشتریان', icon: 'fa-solid fa-database' },
    { id: 'finance', label: 'مشاهده گزارش مالی', icon: 'fa-solid fa-coins' },
  ];
  const [perms, setPerms] = useState<Record<string, boolean>>(Object.fromEntries(PERMISSIONS.map(p => [p.id, true])));
  return (
    <div>
      <div className="p-3 rounded-xl mb-3" style={{ background: '#F59E0B15', border: '1px solid #F59E0B33' }}>
        <div className="text-[11px] flex items-center gap-1.5" style={{ color: '#F59E0B', fontWeight: 600 }}>
          <i className="fa-solid fa-shield-halved" />هر تغییر بلافاصله روی همه ایجنت‌ها اعمال می‌شود
        </div>
      </div>
      <div className="text-[11px] text-[var(--aw-text-muted)] mb-2">{companyAgents.length.toLocaleString('fa-IR')} ایجنت فعال در سازمان شما</div>
      <div className="flex flex-col gap-1.5">
        {PERMISSIONS.map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--aw-bg-card)', border: '1px solid var(--aw-border)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--aw-bg-input)' }}>
              <i className={`${p.icon} text-[13px]`} style={{ color: 'var(--aw-primary)' }} />
            </div>
            <span className="flex-1 text-[12px]" style={{ fontWeight: 600 }}>{p.label}</span>
            <button onClick={() => setPerms(prev => ({ ...prev, [p.id]: !prev[p.id] }))} className="relative w-10 h-5 rounded-full border-none cursor-pointer transition-all" style={{ background: perms[p.id] ? '#10B981' : 'var(--aw-bg-input)' }}>
              <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: '#fff', [perms[p.id] ? 'left' : 'right']: 2 }} />
            </button>
          </div>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-[10px] border-none text-white cursor-pointer text-[13px] mt-4" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { showToast('دسترسی‌ها به‌روزرسانی شد', 'success'); closeModal(); }}>اعمال تغییرات</button>
    </div>
  );
}

export function WorkflowContent() {
  const { showToast, closeModal } = useApp();
  const [workflows, setWorkflows] = useState([
    { id: 'w1', name: 'مشتری جدید → معرفی محصول', trigger: 'ثبت‌نام مشتری', steps: 4, active: true, color: '#10B981' },
    { id: 'w2', name: 'سفارش لغو شد → تماس پیگیری', trigger: 'لغو سفارش', steps: 3, active: true, color: '#F59E0B' },
    { id: 'w3', name: 'مشتری غیرفعال ۳۰ روز → کد تخفیف', trigger: 'عدم فعالیت', steps: 2, active: false, color: '#EC4899' },
    { id: 'w4', name: 'فاکتور پرداخت شد → ارسال رسید + امتیاز', trigger: 'پرداخت موفق', steps: 5, active: true, color: '#3B82F6' },
  ]);
  return (
    <div>
      <div className="p-3 rounded-xl mb-3 flex items-center gap-2.5" style={{ background: 'linear-gradient(135deg, #3B82F622, #1E40AF22)', border: '1px solid #3B82F644' }}>
        <i className="fa-solid fa-diagram-project text-[16px]" style={{ color: '#3B82F6' }} />
        <div className="flex-1">
          <div className="text-[12px]" style={{ fontWeight: 700 }}>ورک‌فلوهای خودکار</div>
          <div className="text-[10px] text-[var(--aw-text-muted)]">اتوماسیون فرآیندها با ترکیب تریگر و اکشن</div>
        </div>
        <button className="px-2.5 py-1 rounded-md border-none cursor-pointer text-[10px] text-white" style={{ background: '#3B82F6', fontWeight: 600 }} onClick={() => showToast('ساخت ورک‌فلو جدید', 'info')}>+ جدید</button>
      </div>
      <div className="flex flex-col gap-2">
        {workflows.map(w => (
          <div key={w.id} className="p-3 rounded-xl" style={{ background: 'var(--aw-bg-card)', border: '1px solid var(--aw-border)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: w.active ? '#10B981' : '#6B7280' }} />
              <span className="text-[12px] flex-1" style={{ fontWeight: 700 }}>{w.name}</span>
              <button onClick={() => setWorkflows(prev => prev.map(x => x.id === w.id ? { ...x, active: !x.active } : x))} className="relative w-9 h-5 rounded-full border-none cursor-pointer" style={{ background: w.active ? '#10B981' : 'var(--aw-bg-input)' }}>
                <span className="absolute top-0.5 w-4 h-4 rounded-full" style={{ background: '#fff', [w.active ? 'left' : 'right']: 2 }} />
              </button>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[var(--aw-text-muted)]">
              <span><i className="fa-solid fa-bolt text-[9px] ml-1" style={{ color: w.color }} />تریگر: {w.trigger}</span>
              <span><i className="fa-solid fa-list-ol text-[9px] ml-1" />{w.steps.toLocaleString('fa-IR')} مرحله</span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-[10px] border-none text-white cursor-pointer text-[13px] mt-4" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { showToast('تنظیمات ورک‌فلو ذخیره شد', 'success'); closeModal(); }}>ذخیره</button>
    </div>
  );
}

export function ToggleAgentContent() {
  const { agents, company, showToast } = useApp();
  const companyAgents = agents.filter(a => !a.company || a.company === company);
  const [states, setStates] = useState<Record<string, boolean>>(Object.fromEntries(companyAgents.map(a => [a.id, !a.locked])));
  const activeCount = Object.values(states).filter(Boolean).length;
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-3 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #10B98122, transparent)', border: '1px solid #10B98144' }}>
          <div className="text-[18px]" style={{ color: '#10B981', fontWeight: 700 }}>{activeCount.toLocaleString('fa-IR')}</div>
          <div className="text-[10px] text-[var(--aw-text-muted)]">فعال</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #6B728022, transparent)', border: '1px solid #6B728044' }}>
          <div className="text-[18px]" style={{ color: '#6B7280', fontWeight: 700 }}>{(companyAgents.length - activeCount).toLocaleString('fa-IR')}</div>
          <div className="text-[10px] text-[var(--aw-text-muted)]">غیرفعال</div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {companyAgents.map(a => (
          <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--aw-bg-card)', border: '1px solid var(--aw-border)' }}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] ${a.bg}`} style={{ fontWeight: 700, opacity: states[a.id] ? 1 : 0.4 }}>{a.init}</div>
            <div className="flex-1">
              <div className="text-[12px]" style={{ fontWeight: 700, opacity: states[a.id] ? 1 : 0.5 }}>{a.name}</div>
              <div className="text-[10px] text-[var(--aw-text-muted)]">{a.role}</div>
            </div>
            <button onClick={() => { setStates(prev => ({ ...prev, [a.id]: !prev[a.id] })); showToast(`${a.name} ${states[a.id] ? 'غیرفعال' : 'فعال'} شد`, 'info'); }} className="relative w-10 h-5 rounded-full border-none cursor-pointer" style={{ background: states[a.id] ? '#10B981' : 'var(--aw-bg-input)' }}>
              <span className="absolute top-0.5 w-4 h-4 rounded-full" style={{ background: '#fff', [states[a.id] ? 'left' : 'right']: 2 }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KpiSettingsContent() {
  const { showToast, closeModal } = useApp();
  const [kpis, setKpis] = useState([
    { id: 'k1', name: 'تعداد گفتگوی روزانه', target: 50, unit: 'گفتگو', icon: 'fa-solid fa-comments', color: '#3B82F6' },
    { id: 'k2', name: 'نرخ تبدیل (Conversion)', target: 15, unit: '٪', icon: 'fa-solid fa-percent', color: '#10B981' },
    { id: 'k3', name: 'میانگین زمان پاسخ', target: 30, unit: 'ثانیه', icon: 'fa-solid fa-stopwatch', color: '#F59E0B' },
    { id: 'k4', name: 'رضایت مشتری (CSAT)', target: 90, unit: '٪', icon: 'fa-solid fa-face-smile', color: '#EC4899' },
    { id: 'k5', name: 'حل تیکت در نوبت اول', target: 75, unit: '٪', icon: 'fa-solid fa-check-double', color: '#8B5CF6' },
  ]);
  return (
    <div>
      <div className="p-3 rounded-xl mb-3" style={{ background: 'linear-gradient(135deg, #B83D9E22, #7E5FAA22)', border: '1px solid #B83D9E44' }}>
        <div className="text-[12px]" style={{ fontWeight: 700 }}><i className="fa-solid fa-gauge-high ml-1.5" />شاخص‌های کلیدی عملکرد (KPI)</div>
        <div className="text-[10px] text-[var(--aw-text-muted)] mt-1">هدف هر شاخص را تعیین کنید تا AI عملکرد ایجنت‌ها را تحلیل کند</div>
      </div>
      <div className="flex flex-col gap-2">
        {kpis.map(k => (
          <div key={k.id} className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--aw-bg-card)', border: '1px solid var(--aw-border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${k.color}22` }}>
              <i className={`${k.icon} text-[14px]`} style={{ color: k.color }} />
            </div>
            <div className="flex-1">
              <div className="text-[12px] mb-1" style={{ fontWeight: 600 }}>{k.name}</div>
              <div className="flex items-center gap-1.5">
                <input type="number" value={k.target} onChange={e => setKpis(prev => prev.map(x => x.id === k.id ? { ...x, target: Number(e.target.value) } : x))} className="w-20 py-1 px-2 rounded-md border text-[11px] text-[var(--aw-text-primary)] outline-none" style={{ background: 'var(--aw-bg-input)', borderColor: 'var(--aw-border)' }} />
                <span className="text-[10px] text-[var(--aw-text-muted)]">{k.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-[10px] border-none text-white cursor-pointer text-[13px] mt-4" style={{ background: 'var(--aw-primary)', fontWeight: 600 }} onClick={() => { showToast('اهداف KPI ذخیره شد', 'success'); closeModal(); }}>ذخیره اهداف</button>
    </div>
  );
}

export function PlansManagementContent() {
  const { showToast, closeModal } = useApp();
  const PLANS = [
    { id: 'p1', name: 'استارتر', price: '۹۰۰K', period: 'ماهانه', color: '#3B82F6', features: ['۲ ایجنت فعال', '۵۰۰ گفتگو در ماه', 'گزارش پایه', 'پشتیبانی ایمیلی'], current: false },
    { id: 'p2', name: 'حرفه‌ای', price: '۲.۵M', period: 'ماهانه', color: '#10B981', features: ['۱۰ ایجنت فعال', 'گفتگوی نامحدود', 'تحلیل پیشرفته AI', 'API + Webhook', 'پشتیبانی ۲۴/۷'], current: true, badge: 'پلن فعلی' },
    { id: 'p3', name: 'سازمانی', price: '۸M', period: 'ماهانه', color: '#FFD700', features: ['ایجنت نامحدود', 'مدل اختصاصی', 'SLA ۹۹.۹٪', 'استقرار اختصاصی', 'مدیر حساب اختصاصی'], current: false, badge: 'محبوب‌ترین' },
  ];
  return (
    <div>
      <div className="p-3 rounded-xl mb-3 flex items-center gap-2.5" style={{ background: 'linear-gradient(135deg, #FFD70022, #F59E0B22)', border: '1px solid #FFD70044' }}>
        <i className="fa-solid fa-crown text-[18px]" style={{ color: '#FFD700' }} />
        <div className="flex-1">
          <div className="text-[12px]" style={{ fontWeight: 700 }}>پلن فعلی: حرفه‌ای</div>
          <div className="text-[10px] text-[var(--aw-text-muted)]">تمدید بعدی: ۱۴۰۴/۱۲/۲۸ — ۲.۵M ت</div>
        </div>
        <button className="px-2.5 py-1 rounded-md border-none cursor-pointer text-[10px]" style={{ background: '#FFD70022', color: '#F59E0B', fontWeight: 600 }} onClick={() => showToast('پلن تمدید شد', 'success')}>تمدید</button>
      </div>
      <div className="flex flex-col gap-2.5">
        {PLANS.map(p => (
          <div key={p.id} className="p-3 rounded-xl" style={{ background: 'var(--aw-bg-card)', border: p.current ? `2px solid ${p.color}` : '1px solid var(--aw-border)', position: 'relative' }}>
            {p.badge && <span className="absolute -top-2 right-3 text-[9px] px-2 py-0.5 rounded-md text-white" style={{ background: p.color, fontWeight: 700 }}>{p.badge}</span>}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[14px]" style={{ color: p.color, fontWeight: 700 }}>{p.name}</div>
                <div className="text-[10px] text-[var(--aw-text-muted)]">{p.period}</div>
              </div>
              <div className="text-left">
                <div className="text-[18px]" style={{ fontWeight: 700 }}>{p.price}<span className="text-[10px] text-[var(--aw-text-muted)] mr-1">ت</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2.5">
              {p.features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-[var(--aw-text-secondary)]">
                  <i className="fa-solid fa-check text-[9px]" style={{ color: p.color }} />{f}
                </div>
              ))}
            </div>
            <button disabled={p.current} className="w-full py-2 rounded-lg border-none cursor-pointer text-[11px]" style={p.current ? { background: 'var(--aw-bg-input)', color: 'var(--aw-text-muted)', fontWeight: 600 } : { background: p.color, color: '#fff', fontWeight: 700 }} onClick={() => { showToast(`ارتقا به پلن ${p.name}`, 'success'); closeModal(); }}>
              {p.current ? 'پلن فعلی شما' : 'ارتقا به این پلن'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppSettingsContent() {
  const { showToast, closeModal, theme, setTheme, agents, company, defaultAgent, setDefaultAgent } = useApp();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const companyAgents = agents.filter(a => !a.company || a.company === company);

  const themeOptions: { id: 'dark' | 'light' | 'bw' | 'glass'; icon: string; label: string }[] = [
    { id: 'glass', icon: 'fa-solid fa-gem', label: 'شیشه‌ای' },
    { id: 'dark', icon: 'fa-solid fa-moon', label: 'تیره' },
    { id: 'light', icon: 'fa-solid fa-sun', label: 'روشن' },
    { id: 'bw', icon: 'fa-solid fa-circle-half-stroke', label: 'سیاه‌سفید' },
  ];

  const settingsItems = [
    { icon: 'fa-solid fa-language', label: 'زبان', desc: 'فارسی', toggle: false },
    { icon: 'fa-solid fa-bell', label: 'اعلان‌ها', desc: notifEnabled ? 'فعال' : 'غیرفعال', toggle: true, checked: notifEnabled, onChange: () => { setNotifEnabled(!notifEnabled); showToast(!notifEnabled ? 'اعلان‌ها فعال شد' : 'اعلان‌ها غیرفعال شد'); } },
    { icon: 'fa-solid fa-volume-up', label: 'صدای اعلان', desc: soundEnabled ? 'فعال' : 'غیرفعال', toggle: true, checked: soundEnabled, onChange: () => { setSoundEnabled(!soundEnabled); showToast(!soundEnabled ? 'صدا فعال شد' : 'صدا غیرفعال شد'); } },
    { icon: 'fa-solid fa-database', label: 'پاک‌سازی کش', desc: 'پاک کردن داده‌های موقت', toggle: false, onClick: () => { showToast('کش پاک‌سازی شد'); closeModal(); } },
  ];

  return (
    <div>
      {/* Theme Selector */}
      <div className="mb-4">
        <div className="text-[12px] text-[var(--aw-text-muted)] mb-2 px-1" style={{ fontWeight: 600 }}>تم برنامه</div>
        <div className="grid grid-cols-2 gap-2">
          {themeOptions.map(t => (
            <button
              key={t.id}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all ${
                theme === t.id
                  ? 'border-[var(--aw-primary)] text-[var(--aw-primary)]'
                  : 'border-[var(--aw-border)] text-[var(--aw-text-secondary)]'
              }`}
              style={{
                background: theme === t.id ? 'var(--aw-primary-bg)' : 'var(--aw-bg-card)',
                fontWeight: theme === t.id ? 700 : 500,
              }}
              onClick={() => {
                setTheme(t.id);
                showToast('تم «' + t.label + '» فعال شد');
              }}
            >
              <i className={`${t.icon} text-lg`} />
              <span className="text-[11px]">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Default Agent Selector */}
      <div className="mb-4">
        <div className="text-[12px] text-[var(--aw-text-muted)] mb-2 px-1" style={{ fontWeight: 600 }}>عامل پیش‌فرض تماس</div>
        <div className="flex flex-col gap-1.5">
          {companyAgents.map(a => {
            const isSelected = defaultAgent === a.id || (!defaultAgent && a === companyAgents[0]);
            return (
              <button
                key={a.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[var(--aw-primary)] text-[var(--aw-text-primary)]'
                    : 'border-[var(--aw-border)] text-[var(--aw-text-secondary)]'
                }`}
                style={{
                  background: isSelected ? 'var(--aw-primary-bg)' : 'var(--aw-bg-card)',
                  fontWeight: isSelected ? 700 : 500,
                }}
                onClick={() => {
                  setDefaultAgent(a.id);
                  showToast('عامل پیش‌فرض: ' + a.name);
                }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px] ${a.bg}`} style={{ fontWeight: 700 }}>{a.init}</div>
                <div className="flex-1 text-right">
                  <div className="text-[13px]">{a.name}</div>
                  <div className="text-[10px] text-[var(--aw-text-muted)]">{a.role}</div>
                </div>
                {isSelected && <i className="fa-solid fa-check-circle text-[var(--aw-primary)]" />}
              </button>
            );
          })}
        </div>
        <div className="text-[10px] text-[var(--aw-text-muted)] mt-1.5 px-1">
          <i className="fa-solid fa-info-circle ml-1" />
          با زدن دکمه میکروفون، تماس مستقیم با این عامل برقرار می‌شود
        </div>
      </div>

      {/* Other settings */}
      {settingsItems.map((item, i) => (
        <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl mb-1.5 border border-[var(--aw-border)]" style={{ background: 'var(--aw-bg-card)' }}
          onClick={item.onClick}>
          <i className={`${item.icon} text-base w-5 text-center text-[var(--aw-primary)]`} />
          <div className="flex-1">
            <div className="text-[13px]" style={{ fontWeight: 500 }}>{item.label}</div>
            <div className="text-[11px] text-[var(--aw-text-muted)]">{item.desc}</div>
          </div>
          {item.toggle && (
            <button
              className="w-11 h-6 rounded-full border-none cursor-pointer transition-all flex items-center px-0.5"
              style={{ background: item.checked ? 'var(--aw-primary)' : 'var(--aw-bg-input)' }}
              onClick={(e) => { e.stopPropagation(); item.onChange?.(); }}
            >
              <div className="w-5 h-5 rounded-full bg-white transition-all" style={{ transform: item.checked ? 'translateX(0)' : 'translateX(20px)' }} />
            </button>
          )}
          {!item.toggle && item.onClick && (
            <i className="fa-solid fa-chevron-left text-[12px] text-[var(--aw-text-muted)]" />
          )}
        </div>
      ))}
    </div>
  );
}

export function AboutContent() {
  return (
    <div className="text-center">
      <img
        src={neuraLogo}
        alt="Neura"
        className="h-14 w-auto object-contain mx-auto mb-4"
        style={{ filter: 'var(--aw-logo-filter)' }}
      />
      <h3 className="text-lg mb-1">Neura</h3>
      <p className="text-[12px] text-[var(--aw-text-secondary)] mb-4">نسخه ۱.۰.۰</p>
      <p className="text-[13px] text-[var(--aw-text-secondary)] mb-4">
        سیستم مدیریت هوشمند کسب‌وکار با عامل‌های AI
      </p>
      <div className="space-y-2 text-[12px] text-[var(--aw-text-muted)]">
        <div className="flex justify-between py-2 border-b border-[var(--aw-border-light)]">
          <span>فریمورک</span>
          <span style={{ fontWeight: 600 }}>React + Tailwind CSS</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[var(--aw-border-light)]">
          <span>طراحی</span>
          <span style={{ fontWeight: 600 }}>RTL / فارسی</span>
        </div>
        <div className="flex justify-between py-2">
          <span>فونت</span>
          <span style={{ fontWeight: 600 }}>Vazirmatn</span>
        </div>
      </div>
    </div>
  );
}

export function LogoutContent() {
  const { closeModal, showToast } = useApp();
  return (
    <div>
      <div className="text-center mb-4">
        <i className="fa-solid fa-sign-out-alt text-[40px] text-[var(--aw-danger)] mb-3 block" />
        <p className="text-[14px]">آیا مطمئن هستید که می‌خواهید خارج شوید؟</p>
        <p className="text-[12px] text-[var(--aw-text-muted)] mt-1">تمام داده‌های ذخیره نشده از بین خواهد رفت</p>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 px-5 border-none rounded-[10px] text-[13px] text-white cursor-pointer" style={{ background: 'var(--aw-danger)', fontWeight: 600 }} onClick={() => { closeModal(); showToast('با موفقیت خارج شدید'); }}>بله، خروج</button>
        <button className="flex-1 py-2.5 px-5 rounded-[10px] text-[13px] cursor-pointer border border-[var(--aw-border)] text-[var(--aw-text-secondary)]" style={{ background: 'transparent', fontWeight: 600 }} onClick={closeModal}>انصراف</button>
      </div>
    </div>
  );
}


export function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[12px] text-[var(--aw-text-secondary)] mb-1.5" style={{ fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full py-2.5 px-3.5 rounded-[10px] border border-[var(--aw-border)] text-[13px] text-[var(--aw-text-primary)] outline-none focus:border-[var(--aw-primary)]"
      style={{ background: 'var(--aw-bg-input)' }}
    />
  );
}

export function FormSelect({ value, onChange, options }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full py-2.5 px-3.5 rounded-[10px] border border-[var(--aw-border)] text-[13px] text-[var(--aw-text-primary)] outline-none appearance-none"
      style={{ background: 'var(--aw-bg-input)' }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

