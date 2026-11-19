import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;



class Main {
    static void show() {
        JFrame frame = new JFrame("Greeting");
        JPanel row = new JPanel();
        JTextField name = new JTextField(10);
        JLabel greeting = new JLabel("Enter your name");
        JButton greet = new JButton("Greet");
        greet.addActionListener(event -> greeting.setText("Hello, " + name.getText()));
        row.add(name);
        row.add(greet);
        row.add(greeting);
        frame.setContentPane(row);

        frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        frame.pack();
        frame.setLocationByPlatform(true);
        frame.setVisible(true);
    }
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(Main::show);
    }
}
