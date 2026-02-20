import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import BreadCrumbComponent from '@/components/layout/sidebar/breadcrumb-component';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <BreadCrumbComponent />
        <div className='min-h-[80vh] mx-4'>{children}</div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
