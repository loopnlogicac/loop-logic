class Copy {
    Copy duplicate() { return new Copy(); }
    String code() { return "general"; }
}
class LabCopy extends Copy {
    @Override
    LabCopy duplicate() { return new LabCopy(); }
    @Override
    String code() { return "lab"; }
}

class Main {
    public static void main(String[] args) {
        LabCopy copy = new LabCopy();
        System.out.println(copy.duplicate().code());
    }
}
