import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;
import java.awt.FlowLayout;



class Main {
    static void show() {
        JFrame frame = new JFrame("Course entry");
        JPanel row = new JPanel(new FlowLayout());
        row.add(new JLabel("Course:"));
        row.add(new JTextField(12));
        row.add(new JButton("Save"));
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
