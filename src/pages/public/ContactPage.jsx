import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = (e) => { e.preventDefault(); toast.success('Message sent! We will reply soon. 📬'); setForm({ name:'',email:'',subject:'',message:'' }); };

  return (
    <div className="bg-dark-bg">
      <div className="bg-hero-gradient py-16 px-4 text-center">
        <div className="relative max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl font-bold text-dark-text mb-3">Contact <span className="text-gradient">Us</span></h1>
          <p className="text-dark-muted">We'd love to hear from you. Send us a message!</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-10">
        <div className="card p-8">
          <h2 className="font-heading text-2xl font-bold text-dark-text mb-6">Send a Message</h2>
          <form onSubmit={submit} className="space-y-4">
            {[{ name:'name',label:'Your Name',type:'text',placeholder:'John Doe' }, { name:'email',label:'Email Address',type:'email',placeholder:'you@example.com' }, { name:'subject',label:'Subject',type:'text',placeholder:'How can we help?' }].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="input-label">{label}</label>
                <input type={type} name={name} value={form[name]} onChange={handle} placeholder={placeholder} required className="input" />
              </div>
            ))}
            <div>
              <label className="input-label">Message</label>
              <textarea name="message" value={form.message} onChange={handle} rows={5} required placeholder="Tell us more..." className="input resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-dark-text mb-4">Get in Touch</h2>
            <p className="text-dark-muted text-sm">Have questions about your order or need help finding a book? We're here for you.</p>
          </div>
          {[{ icon: MapPin, label: 'Address', value: '123 Book Street, Knowledge Park, Mumbai 400001' }, { icon: Phone, label: 'Phone', value: '+91 98765 43210' }, { icon: Mail, label: 'Email', value: 'hello@booknest.in' }].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-dark-muted font-medium">{label}</p>
                <p className="text-sm text-dark-text">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
