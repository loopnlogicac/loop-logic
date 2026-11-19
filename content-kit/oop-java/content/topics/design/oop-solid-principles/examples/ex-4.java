interface WideDevice {
    String scan();
    boolean canPrint();
}
class ScanStation implements WideDevice {
    @Override
    public String scan() { return "page"; }
    @Override
    public boolean canPrint() { return false; }
}
interface ScannerDevice { String scan(); }
class DocumentScanner implements ScannerDevice {
    @Override
    public String scan() { return "page"; }
}

class Main {
    public static void main(String[] args) {
        WideDevice oldDevice = new ScanStation();
        System.out.println(oldDevice.canPrint());
        ScannerDevice device = new DocumentScanner();
        System.out.println(device.scan());
    }
}
